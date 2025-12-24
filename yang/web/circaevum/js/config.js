/**
 * Circaevum Configuration
 * All constants, zoom levels, planet data, and time markers
 */

// ============================================
// PLANET ORBITAL DATA
// ============================================
// Calculate planet's orbital angle based on current date
// Reference: Vernal Equinox (March 20) = 0 radians for Earth
// Earth's orbit counter-clockwise when viewed from above (North)
function calculatePlanetStartAngle(orbitalPeriod, referenceAngle = 0) {
    const now = new Date();
    const year = now.getFullYear();
    
    // Days since start of year
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    
    // For Earth: March 20 (day ~79) is when Earth is at angle 0 (vernal equinox)
    // We need to offset so that angle increases counter-clockwise
    const earthVernalEquinoxDay = 79; // March 20
    
    // Calculate fraction of year elapsed since vernal equinox
    const daysFromEquinox = dayOfYear - earthVernalEquinoxDay;
    const fractionOfYear = daysFromEquinox / 365.25;
    
    // For Earth (orbitalPeriod = 1), one year = one full orbit
    // For other planets, scale by their orbital period
    const fractionOfOrbit = fractionOfYear / orbitalPeriod;
    
    // Angle in radians (counter-clockwise)
    // referenceAngle provides planet-specific offset for their position at vernal equinox
    const angle = referenceAngle + (fractionOfOrbit * Math.PI * 2);
    
    // Normalize to 0-2π
    return ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
}

// Planet reference angles at vernal equinox (approximate positions)
// These values position planets relative to Earth at the equinox
const PLANET_REFERENCE_ANGLES = {
    Mercury: 0,      // Inner planet - position varies greatly
    Venus: Math.PI,  // Inner planet - often opposite Earth
    Earth: 0,        // Reference point
    Mars: Math.PI/2, // Outer planet
    Jupiter: Math.PI,
    Saturn: Math.PI * 1.5,
    Uranus: Math.PI/4,
    Neptune: Math.PI * 0.75
};

const PLANET_DATA = [
    { name: 'Mercury', distance: 19.5, size: 2.5, color: 0x8c7853, speed: 4.15, orbitalPeriod: 0.24, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Mercury); } },
    { name: 'Venus', distance: 36, size: 6, color: 0xffc649, speed: 1.62, orbitalPeriod: 0.615, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Venus); } },
    { name: 'Earth', distance: 50, size: 6.5, color: 0x4a90e2, speed: 1.0, orbitalPeriod: 1.0, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Earth); } },
    { name: 'Mars', distance: 76, size: 3.5, color: 0xdc4c3e, speed: 0.53, orbitalPeriod: 1.88, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Mars); } },
    { name: 'Jupiter', distance: 260, size: 14, color: 0xc88b3a, speed: 0.084, orbitalPeriod: 11.86, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Jupiter); } },
    { name: 'Saturn', distance: 477, size: 12, color: 0xfad5a5, speed: 0.034, orbitalPeriod: 29.46, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Saturn); } },
    { name: 'Uranus', distance: 958, size: 8, color: 0x4fd0e7, speed: 0.012, orbitalPeriod: 84.01, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Uranus); } },
    { name: 'Neptune', distance: 1506, size: 7.5, color: 0x4169e1, speed: 0.006, orbitalPeriod: 164.79, get startAngle() { return calculatePlanetStartAngle(this.orbitalPeriod, PLANET_REFERENCE_ANGLES.Neptune); } }
];

// ============================================
// ZOOM LEVEL CONFIGURATIONS
// ============================================
const ZOOM_LEVELS = {
    0: { name: 'LANDING', span: 'Welcome', distance: 0, height: 0, timeYears: 0, focusTarget: 'none', centerYear: 2025 },
    1: { name: 'CENTURY', span: '100 years', distance: 10000, height: 5000, timeYears: 100, focusTarget: 'sun', centerYear: 2050 },
    2: { name: 'DECADE', span: '10 years', distance: 800, height: 1600, timeYears: 10, focusTarget: 'sun', centerYear: 2025 },
    3: { name: 'YEAR', span: '1 year', distance: 350, height: 800, timeYears: 1, focusTarget: 'sun', centerYear: 2025 },
    4: { name: 'QUARTER', span: '3 months', distance: 200, height: 400, timeYears: 0.25, focusTarget: 'earth', centerYear: 2025 },
    5: { name: 'MONTH', span: '1 month', distance: 70, height: 300, timeYears: 0.0833, focusTarget: 'earth', centerYear: 2025 },
    6: { name: 'LUNAR CYCLE', span: '28 days', distance: 80, height: 240, timeYears: 0.0767, focusTarget: 'earth', centerYear: 2025 },
    7: { name: 'WEEK', span: '7 days', distance: 25, height: 200, timeYears: 0.0192, focusTarget: 'earth', centerYear: 2025 },
    8: { name: 'DAY', span: '24 hours', distance: 40, height: 160, timeYears: 0.00274, focusTarget: 'earth', centerYear: 2025 },
    9: { name: 'CLOCK', span: '24 hours', distance: 25, height: 160, timeYears: 0.00274, focusTarget: 'earth', centerYear: 2025, isPolar: true }
};

// ============================================
// SCENE CONFIGURATION
// ============================================
const SCENE_CONFIG = {
    backgroundColor: 0x000814,
    fogDensity: 0.00005,  // Reduced from 0.00025 for better long-distance visibility
    starCount: 10000,
    starFieldSize: 4000,  // Horizontal spread
    starFieldHeight: 12000,  // Vertical spread to cover century view
    sunSize: 8,  // Reduced from 20 to avoid blocking planets
    sunGlowSize: 10,  // Reduced from 25
    sunColor: 0xffd60a,
    orbitLineColor: 0x00b4d8,
    orbitLineOpacity: 0.3,
    worldlineOpacity: 0.6
};

// ============================================
// TIME CONSTANTS
// ============================================
// Current date reference point
const CURRENT_DATE = new Date(); // Always use actual system time
const CENTURY_START = 2000;
const CENTURY_END = 2100;

// Height units per year (used throughout the application)
const HEIGHT_PER_YEAR = 100;

// ============================================
// TIME MARKERS FOR EACH ZOOM LEVEL
// ============================================
const TIME_MARKERS = {
    1: { // CENTURY - major markers every 25 years, minor every 10 years
        major: [2000, 2025, 2050, 2075, 2100],
        minor: [2010, 2020, 2030, 2040, 2060, 2070, 2080, 2090],
        labelFormat: (year) => year.toString()
    },
    2: { // DECADE - major markers at 2020, 2025, 2030 only
        major: [2020, 2025, 2030],
        minor: [2021, 2022, 2023, 2024, 2026, 2027, 2028, 2029],
        labelFormat: (year) => year.toString()
    },
    3: { // YEAR - major markers every 3 months, minor every month
        major: ['Jan', 'Apr', 'Jul', 'Oct'],
        minor: ['Feb', 'Mar', 'May', 'Jun', 'Aug', 'Sep', 'Nov', 'Dec'],
        labelFormat: (month) => month
    },
    4: { // QUARTER - major markers every month, minor every 2 weeks
        major: ['Month 1', 'Month 2', 'Month 3'],
        minor: ['Week 2', 'Week 4', 'Week 6', 'Week 8', 'Week 10', 'Week 12'],
        labelFormat: (label) => label
    },
    5: { // MONTH - major markers every week, minor every day
        major: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        minor: [], // Too many days to show
        labelFormat: (label) => label
    },
    6: { // LUNAR CYCLE - major markers every 7 days
        major: ['Day 0', 'Day 7', 'Day 14', 'Day 21', 'Day 28'],
        minor: [],
        labelFormat: (label) => label
    },
    7: { // WEEK - major markers each day
        major: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        minor: [],
        labelFormat: (day) => day
    },
    8: { // DAY - major markers every 6 hours
        major: ['00:00', '06:00', '12:00', '18:00', '24:00'],
        minor: ['03:00', '09:00', '15:00', '21:00'],
        labelFormat: (time) => time
    },
    9: { // CLOCK - same as DAY, just different camera view
        major: ['00:00', '06:00', '12:00', '18:00', '24:00'],
        minor: ['03:00', '09:00', '15:00', '21:00'],
        labelFormat: (time) => time
    }
};

// ============================================
// MONTH & DAY NAME CONSTANTS
// ============================================
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBREVIATIONS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_NAMES = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DAY_ABBREVIATIONS = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

// ============================================
// QUARTER NAMES
// ============================================
const QUARTER_NAMES = ['Q1', 'Q2', 'Q3', 'Q4'];
const QUARTER_MONTH_RANGES = [
    [0, 1, 2],   // Q1: Jan, Feb, Mar
    [3, 4, 5],   // Q2: Apr, May, Jun
    [6, 7, 8],   // Q3: Jul, Aug, Sep
    [9, 10, 11]  // Q4: Oct, Nov, Dec
];

// ============================================
// DAYS IN EACH MONTH (non-leap year)
// ============================================
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Get days in a specific month, accounting for leap years
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Number of days in that month
 */
function getDaysInMonth(year, month) {
    const days = [...DAYS_IN_MONTH];
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) {
        days[1] = 29;
    }
    return days[month];
}

/**
 * Check if a year is a leap year
 * @param {number} year - The year to check
 * @returns {boolean} True if leap year
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get total days in a year
 * @param {number} year - The year
 * @returns {number} 365 or 366
 */
function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}


