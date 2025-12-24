#!/usr/bin/env python3
"""
Circaevum Screenshot Organizer

Scans ~/Pictures/Screenshots for Circaevum-related screenshots, copies them to
the repo, and tries to match them to versions/problems using:
- OCR to detect version numbers in images
- File timestamps compared to git commits and changelog dates
- Visual analysis to classify Unity/Web/Backend

Creates a CSV table tracking all screenshots with metadata.
"""

import os
import re
import shutil
import csv
import subprocess
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Tuple
import json

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("Warning: PIL/Pillow not installed. OCR functionality will be limited.")
    print("Install with: pip install Pillow")

try:
    import pytesseract
    HAS_OCR = True
except ImportError:
    HAS_OCR = False
    print("Warning: pytesseract not installed. OCR will be disabled.")
    print("Install with: pip install pytesseract")
    print("Also install tesseract: brew install tesseract (macOS)")

# Configuration
SCREENSHOTS_SOURCE = Path.home() / "Pictures" / "Screenshots"
REPO_ROOT = Path(__file__).parent.parent.parent
SCREENSHOTS_DIR = REPO_ROOT / "docs" / "screenshots"
WEB_SCREENSHOTS = REPO_ROOT / "yang" / "web" / "screenshots"
UNITY_SCREENSHOTS = REPO_ROOT / "yang" / "unity" / "contributions" / "screenshots"
TRACKING_CSV = REPO_ROOT / "zhong" / "tracking" / "screenshot-registry.csv"

# Keywords to identify Circaevum screenshots
CIRCAEVUM_KEYWORDS = [
    "circaevum", "circa", "timebox", "calendarium",
    "zhong", "yin", "yang", "worldline", "planet",
    "calendar", "3d", "unity", "vision pro", "quest"
]

# Version number patterns
VERSION_PATTERNS = [
    r'v?(\d+)\.(\d+)\.(\d+)',  # v0.4.03 or 0.4.03
    r'version\s*:?\s*(\d+)\.(\d+)\.(\d+)',  # version: 0.4.03
    r'v(\d+)\.(\d+)',  # v0.4 (short version)
]

# Image extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'}


def get_file_timestamp(filepath: Path) -> datetime:
    """Get file modification time."""
    return datetime.fromtimestamp(filepath.stat().st_mtime)


def is_circaevum_screenshot(filepath: Path) -> bool:
    """Check if screenshot appears to be Circaevum-related."""
    filename_lower = filepath.name.lower()
    
    # Check filename for keywords (STRICT - only if keyword is found)
    for keyword in CIRCAEVUM_KEYWORDS:
        if keyword in filename_lower:
            return True
    
    # NOTE: Removed the "recent screenshots" heuristic as it was too broad
    # Only screenshots with explicit Circaevum keywords will be identified
    # Users can manually add screenshots by naming them with keywords if needed
    
    return False


def extract_version_from_text(text: str) -> Optional[str]:
    """Extract version number from text using regex patterns."""
    for pattern in VERSION_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            if len(match.groups()) == 3:
                return f"v{match.group(1)}.{match.group(2)}.{match.group(3)}"
            elif len(match.groups()) == 2:
                return f"v{match.group(1)}.{match.group(2)}"
    return None


def ocr_image_for_version(filepath: Path) -> Optional[str]:
    """Use OCR to extract version number from image."""
    if not HAS_PIL or not HAS_OCR:
        return None
    
    try:
        # Read image
        img = Image.open(filepath)
        
        # Try OCR (this can be slow)
        try:
            text = pytesseract.image_to_string(img)
            version = extract_version_from_text(text)
            if version:
                return version
        except Exception as e:
            print(f"  OCR failed: {e}")
        
    except Exception as e:
        print(f"  Could not process image: {e}")
    
    return None


def get_git_commits_by_date(start_date: datetime, end_date: datetime) -> List[Dict]:
    """Get git commits within date range with version info."""
    try:
        # Get commits with dates
        cmd = [
            'git', 'log', '--since', start_date.isoformat(),
            '--until', end_date.isoformat(),
            '--pretty=format:%H|%ai|%s',
            '--all'
        ]
        result = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True)
        
        commits = []
        for line in result.stdout.strip().split('\n'):
            if not line:
                continue
            parts = line.split('|', 2)
            if len(parts) == 3:
                commit_hash, date_str, message = parts
                # Extract version from commit message
                version = extract_version_from_text(message)
                commits.append({
                    'hash': commit_hash,
                    'date': datetime.fromisoformat(date_str.replace(' ', 'T')),
                    'message': message,
                    'version': version
                })
        return commits
    except Exception as e:
        print(f"  Git log failed: {e}")
        return []


def parse_changelog_for_versions() -> List[Dict]:
    """Parse changelogs to extract version-date mappings."""
    versions = []
    
    changelog_files = [
        REPO_ROOT / "yang" / "web" / "CHANGELOG.md",
        REPO_ROOT / "zhong" / "reviews" / "CHANGELOG.md",
        REPO_ROOT / "yang" / "unity" / "avp" / "CHANGELOG.md",
    ]
    
    for changelog_file in changelog_files:
        if not changelog_file.exists():
            continue
        
        try:
            with open(changelog_file, 'r') as f:
                content = f.read()
                
            # Look for version patterns with dates
            # Pattern: v0.4.03 or (v0.4.03-v0.4.04)
            version_date_pattern = r'v(\d+\.\d+\.\d+)(?:\s*-\s*v\d+\.\d+\.\d+)?(?:\s*\(([^)]+)\))?'
            matches = re.finditer(version_date_pattern, content)
            
            for match in matches:
                version = f"v{match.group(1)}"
                # Try to extract date context
                date_context = match.group(2) if match.group(2) else None
                versions.append({
                    'version': version,
                    'date_context': date_context,
                    'source': changelog_file.name
                })
        except Exception as e:
            print(f"  Error parsing {changelog_file}: {e}")
    
    return versions


def classify_platform(filepath: Path, ocr_text: Optional[str] = None) -> str:
    """Classify screenshot as Unity/Web/Backend based on filename and content."""
    filename_lower = filepath.name.lower()
    
    # Check filename
    if 'unity' in filename_lower or 'avp' in filename_lower or 'quest' in filename_lower:
        return "Unity"
    if 'web' in filename_lower or 'three' in filename_lower or 'browser' in filename_lower:
        return "Web"
    if 'backend' in filename_lower or 'api' in filename_lower:
        return "Backend"
    
    # Check OCR text if available
    if ocr_text:
        text_lower = ocr_text.lower()
        if 'unity' in text_lower or 'vision pro' in text_lower:
            return "Unity"
        if 'browser' in text_lower or 'localhost' in text_lower:
            return "Web"
    
    # Default to Unknown
    return "Unknown"


def match_version_by_timestamp(file_timestamp: datetime) -> Optional[str]:
    """Try to match screenshot to version by comparing timestamp to git commits."""
    # Look for commits within 1 day of screenshot
    start_date = file_timestamp
    end_date = file_timestamp
    
    commits = get_git_commits_by_date(
        start_date - timedelta(days=1),
        end_date + timedelta(days=1)
    )
    
    # Find commits with version numbers
    for commit in commits:
        if commit.get('version'):
            return commit['version']
    
    return None


def copy_screenshot(source: Path, platform: str) -> Path:
    """Copy screenshot to appropriate directory in repo."""
    # Determine destination based on platform
    if platform == "Web":
        dest_dir = WEB_SCREENSHOTS
    elif platform == "Unity":
        dest_dir = UNITY_SCREENSHOTS
    else:
        dest_dir = SCREENSHOTS_DIR
    
    # Create directory if it doesn't exist
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp_str = datetime.now().strftime("%Y%m%d-%H%M%S")
    dest_filename = f"{timestamp_str}-{source.name}"
    dest_path = dest_dir / dest_filename
    
    # Copy file
    shutil.copy2(source, dest_path)
    return dest_path


def load_existing_registry() -> Dict[str, Dict]:
    """Load existing screenshot registry to avoid duplicates."""
    registry = {}
    
    if TRACKING_CSV.exists():
        try:
            with open(TRACKING_CSV, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Use original path as key to avoid duplicates
                    if 'original_path' in row:
                        registry[row['original_path']] = row
        except Exception as e:
            print(f"Warning: Could not load existing registry: {e}")
    
    return registry


def save_registry(registry: List[Dict]):
    """Save screenshot registry to CSV."""
    TRACKING_CSV.parent.mkdir(parents=True, exist_ok=True)
    
    fieldnames = [
        'timestamp', 'original_path', 'repo_path', 'platform',
        'version', 'version_source', 'problem_id', 'link_status',
        'file_size', 'image_dimensions', 'notes'
    ]
    
    with open(TRACKING_CSV, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(registry)


def get_image_dimensions(filepath: Path) -> Optional[str]:
    """Get image dimensions if PIL is available."""
    if not HAS_PIL:
        return None
    
    try:
        img = Image.open(filepath)
        return f"{img.width}x{img.height}"
    except:
        return None


def main():
    """Main function to organize screenshots."""
    print("Circaevum Screenshot Organizer")
    print("=" * 50)
    
    if not SCREENSHOTS_SOURCE.exists():
        print(f"Error: Screenshot source directory not found: {SCREENSHOTS_SOURCE}")
        return
    
    print(f"Source: {SCREENSHOTS_SOURCE}")
    print(f"Destination: {SCREENSHOTS_DIR}")
    print()
    
    # Load existing registry
    existing_registry = load_existing_registry()
    print(f"Found {len(existing_registry)} existing screenshots in registry")
    print()
    
    # Scan for screenshots
    all_screenshots = []
    for ext in IMAGE_EXTENSIONS:
        all_screenshots.extend(SCREENSHOTS_SOURCE.glob(f"*{ext}"))
        all_screenshots.extend(SCREENSHOTS_SOURCE.glob(f"*{ext.upper()}"))
    
    print(f"Found {len(all_screenshots)} total screenshots")
    
    # Filter for Circaevum screenshots
    circaevum_screenshots = [s for s in all_screenshots if is_circaevum_screenshot(s)]
    print(f"Identified {len(circaevum_screenshots)} as potentially Circaevum-related")
    print()
    
    # Process each screenshot
    new_entries = []
    skipped = 0
    
    for screenshot in circaevum_screenshots:
        # Skip if already in registry
        if str(screenshot) in existing_registry:
            skipped += 1
            continue
        
        print(f"Processing: {screenshot.name}")
        
        file_timestamp = get_file_timestamp(screenshot)
        
        # Try to extract version
        version = None
        version_source = None
        ocr_text = None
        
        # Method 1: OCR
        if HAS_OCR:
            version = ocr_image_for_version(screenshot)
            if version:
                version_source = "OCR"
                print(f"  Version (OCR): {version}")
        
        # Method 2: Timestamp matching with git commits
        if not version:
            version = match_version_by_timestamp(file_timestamp)
            if version:
                version_source = "Git commit timestamp"
                print(f"  Version (Git): {version}")
        
        # Method 3: Parse changelogs (could be enhanced with date matching)
        # For now, just note if we found versions in changelogs
        changelog_versions = parse_changelog_for_versions()
        
        # Classify platform
        platform = classify_platform(screenshot, ocr_text)
        print(f"  Platform: {platform}")
        
        # Copy to repo
        try:
            dest_path = copy_screenshot(screenshot, platform)
            print(f"  Copied to: {dest_path.relative_to(REPO_ROOT)}")
        except Exception as e:
            print(f"  Error copying: {e}")
            continue
        
        # Determine link status
        link_status = "linked" if version else "unknown"
        problem_id = None  # Could be enhanced to match to problems
        
        # Create registry entry
        entry = {
            'timestamp': file_timestamp.isoformat(),
            'original_path': str(screenshot),
            'repo_path': str(dest_path.relative_to(REPO_ROOT)),
            'platform': platform,
            'version': version or 'unknown',
            'version_source': version_source or 'none',
            'problem_id': problem_id or 'unknown',
            'link_status': link_status,
            'file_size': f"{screenshot.stat().st_size} bytes",
            'image_dimensions': get_image_dimensions(screenshot) or 'unknown',
            'notes': ''
        }
        
        new_entries.append(entry)
        print()
    
    # Combine with existing registry
    all_entries = list(existing_registry.values()) + new_entries
    
    # Save updated registry
    save_registry(all_entries)
    
    print("=" * 50)
    print(f"Summary:")
    print(f"  Processed: {len(circaevum_screenshots)} screenshots")
    print(f"  New: {len(new_entries)}")
    print(f"  Skipped (already in registry): {skipped}")
    print(f"  Total in registry: {len(all_entries)}")
    print(f"  Registry saved to: {TRACKING_CSV.relative_to(REPO_ROOT)}")
    print()
    print("Next steps:")
    print("  1. Review the CSV registry to verify versions and platforms")
    print("  2. Manually update 'problem_id' and 'notes' fields for better tracking")
    print("  3. Re-run script to process new screenshots")


if __name__ == "__main__":
    main()

