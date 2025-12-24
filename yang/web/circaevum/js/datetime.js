/**
 * Circaevum DateTime Module
 * Date initialization and time-to-height calculations
 * 
 * This module contains:
 * - System date initialization
 * - Derived date values (quarter, week, etc.)
 * - Height calculations for time positions
 * - Date progress calculations
 * 
 * Dependencies: config.js (CENTURY_START, ZOOM_LEVELS)
 */

// ============================================
// CURRENT DATE STATE
// ============================================

// Initialize current date from system
const now = new Date();

// Primary date values from system
let currentYear = now.getFullYear();
let currentMonthInYear = now.getMonth(); // 0-11
let currentDayOfMonth = now.getDate(); // 1-31
let currentHourInDay = now.getHours(); // 0-23
let currentMinute = now.getMinutes(); // 0-59
let currentSecond = now.getSeconds(); // 0-59

// Derived date values
let currentQuarter = Math.floor(currentMonthInYear / 3); // 0-3 for Q1-Q4
let currentMonth = currentMonthInYear % 3; // Month within quarter (0-2)
let currentDayInWeek = now.getDay(); // 0=Sunday, 6=Saturday

// Calculate which calendar week of the month we're in (based on Sundays)
// Find the first Sunday of the month (or count from Sunday before the 1st)
const firstOfMonth = new Date(currentYear, currentMonthInYear, 1);
const firstSundayOffset = -firstOfMonth.getDay(); // Days to go back to get Sunday (0 if 1st is Sunday)
let currentWeekInMonth = Math.floor((currentDayOfMonth - 1 - firstSundayOffset) / 7);

// Log initialization
console.log('Circaevum DateTime initialized:', now.toISOString());
console.log('Date values:', {
    year: currentYear,
    monthInYear: currentMonthInYear,
    dayOfMonth: currentDayOfMonth,
    hourInDay: currentHourInDay,
    quarter: currentQuarter,
    monthInQuarter: currentMonth,
    weekInMonth: currentWeekInMonth,
    dayInWeek: currentDayInWeek
});

// ============================================
// NAVIGATION OFFSET STATE
// ============================================

// Navigation offsets (initially zero - at current time)
let selectedYearOffset = 0;
let selectedQuarterOffset = 0;
let selectedWeekOffset = 0;
let selectedDayOffset = 0;
let selectedHourOffset = 0;
let selectedLunarOffset = 0;
let selectedDecadeOffset = 0;

// ============================================
// HEIGHT CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate height (Y position) for a given year
 * Height is measured from year 2000 (CENTURY_START)
 * 
 * @param {number} year - The year to calculate height for
 * @param {number} zoomLevel - Current zoom level (unused but kept for API consistency)
 * @returns {number} Height in scene units (100 units per year)
 */
function getHeightForYear(year, zoomLevel) {
    const yearsSinceCenturyStart = year - CENTURY_START;
    const heightPerYear = HEIGHT_PER_YEAR; // 100 units per year (from config.js)
    return yearsSinceCenturyStart * heightPerYear;
}

/**
 * Calculate the precise current date height including month, day, and hour
 * @returns {number} Height in scene units
 */
function calculateCurrentDateHeight() {
    const yearHeight = HEIGHT_PER_YEAR;
    const baseYearHeight = getHeightForYear(currentYear, 1);
    
    // Get days in current month
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonthInYear);
    
    // Calculate fractional progress through the year
    const monthProgress = currentMonthInYear / 12;
    const dayProgress = (currentDayOfMonth - 1) / (daysInCurrentMonth * 12);
    const hourProgress = currentHourInDay / (24 * daysInCurrentMonth * 12);
    
    const totalYearProgress = monthProgress + dayProgress + hourProgress;
    
    return baseYearHeight + (totalYearProgress * yearHeight);
}

/**
 * Calculate height for a specific date
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} day - Day of month (1-31)
 * @param {number} hour - Hour (0-23)
 * @returns {number} Height in scene units
 */
function calculateDateHeight(year, month, day, hour = 0) {
    const yearHeight = HEIGHT_PER_YEAR;
    const baseYearHeight = getHeightForYear(year, 1);
    
    const daysInMonth = getDaysInMonth(year, month);
    
    const monthProgress = month / 12;
    const dayProgress = (day - 1) / (daysInMonth * 12);
    const hourProgress = hour / (24 * daysInMonth * 12);
    
    const totalYearProgress = monthProgress + dayProgress + hourProgress;
    
    return baseYearHeight + (totalYearProgress * yearHeight);
}

/**
 * Calculate progress through current year (0.0 to 1.0)
 * @returns {number} Fraction of year elapsed
 */
function calculateYearProgress() {
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonthInYear);
    
    // Days elapsed this year
    let daysElapsed = 0;
    for (let m = 0; m < currentMonthInYear; m++) {
        daysElapsed += getDaysInMonth(currentYear, m);
    }
    daysElapsed += currentDayOfMonth - 1;
    daysElapsed += currentHourInDay / 24;
    
    const totalDays = getDaysInYear(currentYear);
    return daysElapsed / totalDays;
}

/**
 * Calculate progress through current quarter (0.0 to 1.0)
 * @returns {number} Fraction of quarter elapsed
 */
function calculateQuarterProgress() {
    const quarterStartMonth = currentQuarter * 3;
    const monthsIntoQuarter = currentMonthInYear - quarterStartMonth;
    
    // Calculate days in each month of this quarter
    let totalDaysInQuarter = 0;
    let daysElapsedInQuarter = 0;
    
    for (let m = 0; m < 3; m++) {
        const monthIndex = quarterStartMonth + m;
        const daysInThisMonth = getDaysInMonth(currentYear, monthIndex);
        totalDaysInQuarter += daysInThisMonth;
        
        if (m < monthsIntoQuarter) {
            daysElapsedInQuarter += daysInThisMonth;
        } else if (m === monthsIntoQuarter) {
            daysElapsedInQuarter += currentDayOfMonth - 1 + (currentHourInDay / 24);
        }
    }
    
    return daysElapsedInQuarter / totalDaysInQuarter;
}

/**
 * Calculate progress through current month (0.0 to 1.0)
 * @returns {number} Fraction of month elapsed
 */
function calculateMonthProgress() {
    const daysInMonth = getDaysInMonth(currentYear, currentMonthInYear);
    const dayProgress = (currentDayOfMonth - 1 + currentHourInDay / 24) / daysInMonth;
    return dayProgress;
}

/**
 * Calculate progress through current week (0.0 to 1.0)
 * Week starts on Sunday (day 0)
 * @returns {number} Fraction of week elapsed
 */
function calculateWeekProgress() {
    return (currentDayInWeek + currentHourInDay / 24) / 7;
}

/**
 * Calculate progress through current day (0.0 to 1.0)
 * @returns {number} Fraction of day elapsed
 */
function calculateDayProgress() {
    return (currentHourInDay + currentMinute / 60 + currentSecond / 3600) / 24;
}

// ============================================
// DATE REFRESH FUNCTION
// ============================================

/**
 * Refresh all date values from system time
 * Call this to update the current time reference
 */
function refreshCurrentDate() {
    const refreshedNow = new Date();
    
    currentYear = refreshedNow.getFullYear();
    currentMonthInYear = refreshedNow.getMonth();
    currentDayOfMonth = refreshedNow.getDate();
    currentHourInDay = refreshedNow.getHours();
    currentMinute = refreshedNow.getMinutes();
    currentSecond = refreshedNow.getSeconds();
    
    // Recalculate derived values
    currentQuarter = Math.floor(currentMonthInYear / 3);
    currentMonth = currentMonthInYear % 3;
    currentDayInWeek = refreshedNow.getDay();
    
    // Calculate which calendar week of the month we're in (based on Sundays)
    const refreshedFirstOfMonth = new Date(currentYear, currentMonthInYear, 1);
    const refreshedFirstSundayOffset = -refreshedFirstOfMonth.getDay();
    currentWeekInMonth = Math.floor((currentDayOfMonth - 1 - refreshedFirstSundayOffset) / 7);
    
    console.log('DateTime refreshed:', refreshedNow.toISOString());
}

/**
 * Reset all navigation offsets to zero (return to present)
 */
function resetNavigationOffsets() {
    selectedYearOffset = 0;
    selectedQuarterOffset = 0;
    selectedWeekOffset = 0;
    selectedDayOffset = 0;
    selectedHourOffset = 0;
    selectedLunarOffset = 0;
    selectedDecadeOffset = 0;
}

// ============================================
// DATE FORMATTING HELPERS
// ============================================

/**
 * Get formatted date string
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} day
 * @returns {string} Formatted date like "December 9, 2025"
 */
function formatDate(year, month, day) {
    return `${MONTH_NAMES[month]} ${day}, ${year}`;
}

/**
 * Get short formatted date string
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} day
 * @returns {string} Formatted date like "Dec 9, 2025"
 */
function formatDateShort(year, month, day) {
    return `${MONTH_ABBREVIATIONS[month]} ${day}, ${year}`;
}

/**
 * Get quarter name for a month
 * @param {number} month - 0-indexed month (0-11)
 * @returns {string} Quarter name like "Q4"
 */
function getQuarterName(month) {
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter}`;
}

/**
 * Get current date as formatted string
 * @returns {string} Current date formatted
 */
function getCurrentDateFormatted() {
    return formatDate(currentYear, currentMonthInYear, currentDayOfMonth);
}


