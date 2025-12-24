# Unity Backend Adapter: Nakama → REST API Migration

## Overview

This document shows how to create a **backend-swappable adapter** for Unity that:
- ✅ Keeps existing Nakama code working (TimeBox, Calendarium)
- ✅ Allows gradual migration to REST API
- ✅ Maintains same interface (`IEventStorage`)
- ✅ Easy to switch backends

---

## Current Unity Architecture

### TimeBox (Apple Vision Pro)

**Components**:
- `NakamaDeviceManager` - Device session management
- `NakamaUserManager` - User authentication
- `NakamaStorageService` - Event storage (implements `IEventStorage`)

**Pattern**:
```csharp
// Device session
deviceSession = await client.AuthenticateDeviceAsync(deviceId);

// User session
userSession = await client.AuthenticateEmailAsync(email, password);

// Load events
var events = await storageService.LoadEvents(client, userSession);

// Save events
await storageService.SaveEvent(evt);
```

### Calendarium (Meta Quest/Desktop)

**Components**:
- `NakamaClient` - Combined device/user session management

**Pattern**:
```csharp
// Device session
deviceSession = await client.AuthenticateDeviceAsync(deviceId);

// User session
UserSession = await client.AuthenticateEmailAsync(email, password);

// Storage operations via NakamaStorageService
```

---

## Adapter Pattern Implementation

### Step 1: Create Backend Interface

```csharp
// Assets/Circaevum/Pipeline/IBackendAdapter.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Apis.Calendar.v3.Data;

namespace Circaevum.IntegrationControl
{
    /// <summary>
    /// Backend adapter interface - allows switching between Nakama and REST API
    /// </summary>
    public interface IBackendAdapter
    {
        // Authentication
        Task<ISession> AuthenticateDeviceAsync(string deviceId);
        Task<ISession> AuthenticateUserAsync(string email, string password, string username = null, bool create = false);
        
        // Event operations
        Task<List<Event>> GetEventsAsync(ISession session, string userId, TimeRange range = null);
        Task<bool> SaveEventAsync(ISession session, Event evt);
        Task<bool> SaveEventsBatchAsync(ISession session, IEnumerable<Event> events, int batchSize = 25);
        Task<bool> IsEventExistsAsync(ISession session, string eventId);
        
        // Token operations
        Task<List<TokenObject>> LoadTokensAsync(ISession session);
        Task SaveTokenAsync(ISession session, string token, string accessToken, string refreshToken);
        
        // Session linking
        Task LinkSessionsAsync(ISession userSession, ISession deviceSession);
    }
    
    public class TimeRange
    {
        public System.DateTime? Start { get; set; }
        public System.DateTime? End { get; set; }
    }
}
```

### Step 2: Nakama Adapter (Keep Existing Code)

```csharp
// Assets/Circaevum/Pipeline/Adapters/NakamaAdapter.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Nakama;
using Google.Apis.Calendar.v3.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Circaevum.IntegrationControl
{
    /// <summary>
    /// Nakama backend adapter - wraps existing Nakama code
    /// </summary>
    public class NakamaAdapter : IBackendAdapter
    {
        private IClient client;
        
        public NakamaAdapter(string scheme, string host, int port, string serverKey)
        {
            client = new Nakama.Client(
                scheme,
                host,
                port,
                serverKey,
                Nakama.UnityWebRequestAdapter.Instance
            );
        }
        
        public async Task<ISession> AuthenticateDeviceAsync(string deviceId)
        {
            var sessionTask = client.AuthenticateDeviceAsync(deviceId);
            var timeoutTask = Task.Delay(15000);
            var completedTask = await Task.WhenAny(sessionTask, timeoutTask);
            
            if (completedTask == timeoutTask)
                throw new System.Exception("Device authentication timed out");
            
            return await sessionTask;
        }
        
        public async Task<ISession> AuthenticateUserAsync(string email, string password, string username = null, bool create = false)
        {
            return await client.AuthenticateEmailAsync(email, password, username, create);
        }
        
        public async Task<List<Event>> GetEventsAsync(ISession session, string userId, TimeRange range = null)
        {
            var events = new List<Event>();
            const int limit = 100;
            string cursor = null;
            
            do
            {
                var listTask = client.ListUsersStorageObjectsAsync(session, "events", userId, limit, cursor);
                var timeoutTask = Task.Delay(10000);
                var completedTask = await Task.WhenAny(listTask, timeoutTask);
                
                if (completedTask == timeoutTask)
                {
                    Debug.LogError("[NakamaAdapter] GetEventsAsync timed out");
                    break;
                }
                
                var result = await listTask;
                
                foreach (var obj in result.Objects)
                {
                    try
                    {
                        var j = JObject.Parse(obj.Value);
                        var evt = ParseGoogleEvent(j);
                        
                        // Filter by time range if provided
                        if (range != null)
                        {
                            if (range.Start.HasValue && evt.Start?.DateTime < range.Start.Value)
                                continue;
                            if (range.End.HasValue && evt.Start?.DateTime > range.End.Value)
                                continue;
                        }
                        
                        events.Add(evt);
                    }
                    catch (System.Exception ex)
                    {
                        Debug.LogError($"[NakamaAdapter] Failed to parse event: {ex.Message}");
                    }
                }
                
                cursor = result.Cursor;
            } while (cursor != null);
            
            return events;
        }
        
        public async Task<bool> SaveEventAsync(ISession session, Event evt)
        {
            try
            {
                var writeObj = new WriteStorageObject
                {
                    Collection = "events",
                    Key = BuildStorageKey(evt.Id),
                    Value = BuildMinimalEventJson(evt)
                };
                
                await client.WriteStorageObjectsAsync(session, new[] { writeObj });
                return true;
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[NakamaAdapter] SaveEventAsync failed: {ex.Message}");
                return false;
            }
        }
        
        public async Task<bool> SaveEventsBatchAsync(ISession session, IEnumerable<Event> events, int batchSize = 25)
        {
            var eventList = new List<Event>(events);
            
            for (int i = 0; i < eventList.Count; i += batchSize)
            {
                var batch = eventList.Skip(i).Take(batchSize).ToList();
                var writeObjects = new List<IApiWriteStorageObject>(batch.Count);
                
                foreach (var evt in batch)
                {
                    writeObjects.Add(new WriteStorageObject
                    {
                        Collection = "events",
                        Key = BuildStorageKey(evt.Id),
                        Value = BuildMinimalEventJson(evt)
                    });
                }
                
                try
                {
                    await client.WriteStorageObjectsAsync(session, writeObjects.ToArray());
                }
                catch (System.Exception ex)
                {
                    Debug.LogError($"[NakamaAdapter] SaveEventsBatchAsync failed: {ex.Message}");
                    return false;
                }
            }
            
            return true;
        }
        
        public async Task<bool> IsEventExistsAsync(ISession session, string eventId)
        {
            try
            {
                var result = await client.ListUsersStorageObjectsAsync(
                    session, "events", session.UserId, 1, null
                );
                
                return result?.Objects != null && 
                       result.Objects.Any(obj => obj.Key == BuildStorageKey(eventId));
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<List<TokenObject>> LoadTokensAsync(ISession session)
        {
            var tokens = new List<TokenObject>();
            const int limit = 10;
            var allResults = new List<IApiStorageObjectList>();
            
            var result = await client.ListUsersStorageObjectsAsync(session, "tokens", session.UserId, limit);
            allResults.Add(result);
            
            while (result.Cursor != null)
            {
                result = await client.ListUsersStorageObjectsAsync(session, "tokens", session.UserId, limit, result.Cursor);
                allResults.Add(result);
            }
            
            foreach (var apiResult in allResults)
            {
                foreach (var obj in apiResult.Objects)
                {
                    if (!string.IsNullOrEmpty(obj.Value))
                    {
                        var token = JsonUtility.FromJson<TokenObject>(obj.Value);
                        tokens.Add(token);
                    }
                }
            }
            
            return tokens;
        }
        
        public async Task SaveTokenAsync(ISession session, string token, string accessToken, string refreshToken)
        {
            int time = new Sundial().now;
            var tokenRow = JsonConvert.SerializeObject(new
            {
                Token = token,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Issued = System.DateTime.Now,
                IssuedUTC = System.DateTime.UtcNow
            });
            
            var writeObj = new WriteStorageObject
            {
                Collection = "tokens",
                Key = time.ToString(),
                Value = tokenRow
            };
            
            await client.WriteStorageObjectsAsync(session, new[] { writeObj });
        }
        
        public async Task LinkSessionsAsync(ISession userSession, ISession deviceSession)
        {
            // Link device to user
            var deviceRow = JsonConvert.SerializeObject(new
            {
                deviceId = SystemInfo.deviceUniqueIdentifier,
                deviceModel = SystemInfo.deviceModel,
                deviceType = SystemInfo.deviceType,
                deviceName = SystemInfo.deviceName
            });
            
            var saveDeviceToUser = new WriteStorageObject
            {
                Collection = "devices",
                Key = userSession.Username + "'s " + SystemInfo.deviceName,
                Value = deviceRow
            };
            await client.WriteStorageObjectsAsync(userSession, new[] { saveDeviceToUser });
            
            // Link user to device
            var userData = JsonConvert.SerializeObject(new
            {
                userId = userSession.UserId,
                userName = userSession.Username,
                auto_login = true
            });
            
            var saveUserToDevice = new WriteStorageObject
            {
                Collection = "users",
                Key = SystemInfo.deviceName + " ID: " + SystemInfo.deviceUniqueIdentifier,
                Value = userData
            };
            await client.WriteStorageObjectsAsync(deviceSession, new[] { saveUserToDevice });
        }
        
        // Helper methods (from your existing code)
        private Event ParseGoogleEvent(JObject j)
        {
            // Your existing parsing logic from NakamaStorageService
            var evt = new Event
            {
                Id = (string)j["id"],
                Summary = (string)j["summary"],
                Description = (string)j["description"],
                ColorId = (string)j["colorId"],
                Location = (string)j["location"]
            };
            
            var startDateTimeStr = (string)j["start"]?["dateTime"];
            var endDateTimeStr = (string)j["end"]?["dateTime"];
            
            if (!string.IsNullOrEmpty(startDateTimeStr))
            {
                if (System.DateTimeOffset.TryParse(startDateTimeStr, out var sDto))
                    evt.Start = new EventDateTime { DateTime = sDto.LocalDateTime };
            }
            
            if (!string.IsNullOrEmpty(endDateTimeStr))
            {
                if (System.DateTimeOffset.TryParse(endDateTimeStr, out var eDto))
                    evt.End = new EventDateTime { DateTime = eDto.LocalDateTime };
            }
            
            return evt;
        }
        
        private string BuildMinimalEventJson(Event evt)
        {
            // Your existing BuildMinimalEventJson logic
            var obj = new JObject
            {
                ["id"] = evt.Id,
                ["summary"] = evt.Summary,
                ["description"] = evt.Description,
                ["colorId"] = evt.ColorId,
                ["location"] = evt.Location
            };
            
            var startObj = new JObject();
            if (evt.Start?.DateTime.HasValue == true)
                startObj["dateTime"] = evt.Start.DateTime.Value.ToString("o");
            obj["start"] = startObj;
            
            var endObj = new JObject();
            if (evt.End?.DateTime.HasValue == true)
                endObj["dateTime"] = evt.End.DateTime.Value.ToString("o");
            obj["end"] = endObj;
            
            return obj.ToString(Formatting.None);
        }
        
        private string BuildStorageKey(string eventId)
        {
            // Your existing BuildStorageKey logic
            if (string.IsNullOrEmpty(eventId)) return System.Guid.NewGuid().ToString("N");
            using (var sha = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(eventId);
                var hash = sha.ComputeHash(bytes);
                var sb = new System.Text.StringBuilder(32);
                for (int i = 0; i < 16; i++) sb.Append(hash[i].ToString("x2"));
                return $"gcal_{sb}";
            }
        }
    }
}
```

### Step 3: REST API Adapter (New)

```csharp
// Assets/Circaevum/Pipeline/Adapters/RESTAdapter.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;
using Google.Apis.Calendar.v3.Data;
using Newtonsoft.Json;

namespace Circaevum.IntegrationControl
{
    /// <summary>
    /// REST API backend adapter - new backend for web optimization
    /// </summary>
    public class RESTAdapter : IBackendAdapter
    {
        private string baseUrl;
        private string authToken;
        
        public RESTAdapter(string baseUrl)
        {
            this.baseUrl = baseUrl.TrimEnd('/');
        }
        
        public async Task<ISession> AuthenticateDeviceAsync(string deviceId)
        {
            // REST API doesn't need device session - return mock session
            return new RESTSession { UserId = $"device_{deviceId}", IsDevice = true };
        }
        
        public async Task<ISession> AuthenticateUserAsync(string email, string password, string username = null, bool create = false)
        {
            var endpoint = create ? "/api/auth/signup" : "/api/auth/login";
            var request = new UnityWebRequest($"{baseUrl}{endpoint}", "POST");
            
            var body = JsonUtility.ToJson(new { email, password, username });
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(body));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
            
            if (request.result != UnityWebRequest.Result.Success)
            {
                throw new System.Exception($"Authentication failed: {request.error}");
            }
            
            var response = JsonUtility.FromJson<AuthResponse>(request.downloadHandler.text);
            authToken = response.token;
            
            return new RESTSession 
            { 
                UserId = response.userId,
                Username = response.username,
                AuthToken = authToken
            };
        }
        
        public async Task<List<Event>> GetEventsAsync(ISession session, string userId, TimeRange range = null)
        {
            var url = $"{baseUrl}/api/events?userId={userId}";
            if (range != null)
            {
                if (range.Start.HasValue)
                    url += $"&start={range.Start.Value:O}";
                if (range.End.HasValue)
                    url += $"&end={range.End.Value:O}";
            }
            
            var request = UnityWebRequest.Get(url);
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
            
            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"[RESTAdapter] GetEventsAsync failed: {request.error}");
                return new List<Event>();
            }
            
            var response = JsonUtility.FromJson<EventsResponse>(request.downloadHandler.text);
            return response.events ?? new List<Event>();
        }
        
        public async Task<bool> SaveEventAsync(ISession session, Event evt)
        {
            var request = new UnityWebRequest($"{baseUrl}/api/events", "POST");
            var body = JsonConvert.SerializeObject(evt);
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(body));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
            
            return request.result == UnityWebRequest.Result.Success;
        }
        
        public async Task<bool> SaveEventsBatchAsync(ISession session, IEnumerable<Event> events, int batchSize = 25)
        {
            var eventList = new List<Event>(events);
            
            for (int i = 0; i < eventList.Count; i += batchSize)
            {
                var batch = eventList.Skip(i).Take(batchSize).ToList();
                var request = new UnityWebRequest($"{baseUrl}/api/events/batch", "POST");
                var body = JsonConvert.SerializeObject(new { events = batch });
                request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(body));
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");
                request.SetRequestHeader("Authorization", $"Bearer {authToken}");
                
                var operation = request.SendWebRequest();
                while (!operation.isDone) await Task.Yield();
                
                if (request.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"[RESTAdapter] SaveEventsBatchAsync failed: {request.error}");
                    return false;
                }
            }
            
            return true;
        }
        
        public async Task<bool> IsEventExistsAsync(ISession session, string eventId)
        {
            var request = UnityWebRequest.Get($"{baseUrl}/api/events/{eventId}");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
            
            return request.result == UnityWebRequest.Result.Success;
        }
        
        public async Task<List<TokenObject>> LoadTokensAsync(ISession session)
        {
            var request = UnityWebRequest.Get($"{baseUrl}/api/tokens");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
            
            if (request.result != UnityWebRequest.Result.Success)
            {
                return new List<TokenObject>();
            }
            
            var response = JsonUtility.FromJson<TokensResponse>(request.downloadHandler.text);
            return response.tokens ?? new List<TokenObject>();
        }
        
        public async Task SaveTokenAsync(ISession session, string token, string accessToken, string refreshToken)
        {
            var request = new UnityWebRequest($"{baseUrl}/api/tokens", "POST");
            var body = JsonUtility.ToJson(new { token, accessToken, refreshToken });
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(body));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
        }
        
        public async Task LinkSessionsAsync(ISession userSession, ISession deviceSession)
        {
            // REST API doesn't need device linking - handled server-side
            // Can be a no-op or send device info to server
            var request = new UnityWebRequest($"{baseUrl}/api/devices/link", "POST");
            var body = JsonUtility.ToJson(new
            {
                deviceId = SystemInfo.deviceUniqueIdentifier,
                deviceModel = SystemInfo.deviceModel,
                deviceName = SystemInfo.deviceName
            });
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(body));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            var operation = request.SendWebRequest();
            while (!operation.isDone) await Task.Yield();
        }
    }
    
    // Helper classes
    public class RESTSession : ISession
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string AuthToken { get; set; }
        public bool IsDevice { get; set; }
        public bool IsExpired => false; // REST API handles expiration server-side
    }
    
    [System.Serializable]
    public class AuthResponse
    {
        public string token;
        public string userId;
        public string username;
    }
    
    [System.Serializable]
    public class EventsResponse
    {
        public List<Event> events;
    }
    
    [System.Serializable]
    public class TokensResponse
    {
        public List<TokenObject> tokens;
    }
}
```

### Step 4: Update Existing Components to Use Adapter

```csharp
// Assets/Circaevum/Pipeline/NakamaStorageService.cs (Updated)
public class NakamaStorageService : MonoBehaviour, IEventStorage
{
    private IBackendAdapter backend; // Changed from IClient
    
    public void Init(IBackendAdapter backendAdapter, ISession session)
    {
        this.backend = backendAdapter;
        this.userSession = session;
    }
    
    public async Task<List<Event>> GetEvents()
    {
        if (backend == null || userSession == null)
            return new List<Event>();
        
        // Use adapter instead of direct Nakama calls
        return await backend.GetEventsAsync(userSession, userSession.UserId);
    }
    
    public async Task<bool> SaveEvent(Event evt)
    {
        if (backend == null || userSession == null)
            return false;
        
        return await backend.SaveEventAsync(userSession, evt);
    }
    
    // ... rest of methods use backend adapter
}
```

### Step 5: Configuration (Easy Backend Switching)

```csharp
// Assets/Circaevum/Pipeline/BackendConfig.cs
using UnityEngine;

namespace Circaevum.IntegrationControl
{
    [CreateAssetMenu(fileName = "BackendConfig", menuName = "Circaevum/Backend Config")]
    public class BackendConfig : ScriptableObject
    {
        public enum BackendType
        {
            Nakama,
            REST
        }
        
        [Header("Backend Selection")]
        public BackendType backendType = BackendType.Nakama;
        
        [Header("Nakama Settings")]
        public string nakamaScheme = "http";
        public string nakamaHost = "142.93.251.136";
        public int nakamaPort = 7350;
        public string nakamaServerKey = "defaultkey";
        
        [Header("REST API Settings")]
        public string restApiUrl = "https://api.circaevum.com";
        
        public IBackendAdapter CreateAdapter()
        {
            switch (backendType)
            {
                case BackendType.Nakama:
                    return new NakamaAdapter(nakamaScheme, nakamaHost, nakamaPort, nakamaServerKey);
                
                case BackendType.REST:
                    return new RESTAdapter(restApiUrl);
                
                default:
                    return new NakamaAdapter(nakamaScheme, nakamaHost, nakamaPort, nakamaServerKey);
            }
        }
    }
}
```

---

## Migration Path

### Phase 1: Add Adapter Layer (No Breaking Changes)

1. **Create adapter interfaces** (`IBackendAdapter`)
2. **Create Nakama adapter** (wraps existing code)
3. **Update components** to use adapter (instead of direct `IClient`)
4. **Test**: Everything still works with Nakama

### Phase 2: Add REST Adapter

1. **Create REST adapter** (new implementation)
2. **Test REST adapter** (with test REST API)
3. **Add configuration** (ScriptableObject for backend selection)

### Phase 3: Migrate Unity (When Ready)

1. **Switch config** to REST backend
2. **Test Unity builds** (TimeBox, Calendarium)
3. **Deprecate Nakama** (if desired)

---

## Benefits

✅ **No Breaking Changes**: Existing code keeps working
✅ **Easy Testing**: Can test REST API while Unity uses Nakama
✅ **Gradual Migration**: Switch when convenient
✅ **Flexible**: Can keep both backends if needed
✅ **Same Interface**: `IEventStorage` works with both

---

## Next Steps

1. **Create adapter interfaces** in Unity project
2. **Wrap existing Nakama code** in adapter
3. **Update components** to use adapter
4. **Test**: Verify everything still works
5. **Add REST adapter** when REST API is ready

**Result**: Backend-swappable Unity code that supports gradual migration!

