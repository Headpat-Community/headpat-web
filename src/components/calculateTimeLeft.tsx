// Constants for time calculations (avoid repeated calculations)
const MILLISECONDS_PER_SECOND = 1000
const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * 60
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24

// Cache for time calculations to avoid repeated operations
const timeCalculationCache = new Map<string, string>()

// Cache for date formatting to avoid repeated operations
const dateFormatCache = new Map<string, string>()

// Cleanup function to prevent memory leaks
export const clearTimeCalculationCache = () => {
  timeCalculationCache.clear()
  dateFormatCache.clear()
}

// Utility function for efficient date formatting
const formatDateComponent = (value: number): string => {
  return value.toString().padStart(2, "0")
}

export const calculateTimeLeft = (
  eventDate: string,
  eventEndDate: string,
  upcoming: boolean = false
) => {
  const now = new Date()
  const eventStart = new Date(eventDate)
  const eventEnd = new Date(eventEndDate)

  // Calculate time differences once
  const upcomingTime = eventStart.getTime() - now.getTime()
  const differenceInTime = eventEnd.getTime() - now.getTime()
  const timeLeft = upcoming ? upcomingTime : differenceInTime

  // Early return for ended events
  if (differenceInTime < 0) {
    return "Event has ended"
  }

  // Cache key for this calculation
  const cacheKey = `${timeLeft}_${upcoming}`

  // Check cache first
  if (timeCalculationCache.has(cacheKey)) {
    return timeCalculationCache.get(cacheKey)!
  }

  let result: string

  if (now < eventStart) {
    // Event hasn't started yet
    if (timeLeft > MILLISECONDS_PER_DAY) {
      const days = Math.ceil(timeLeft / MILLISECONDS_PER_DAY)
      result = `${days} days left`
    } else if (timeLeft > MILLISECONDS_PER_HOUR) {
      const hours = Math.ceil(timeLeft / MILLISECONDS_PER_HOUR)
      result = `${hours} hours left`
    } else {
      const minutes = Math.ceil(timeLeft / MILLISECONDS_PER_MINUTE)
      result = `${minutes} minutes left`
    }
  } else {
    // Event has started, but not ended
    if (timeLeft > MILLISECONDS_PER_DAY) {
      const days = Math.ceil(timeLeft / MILLISECONDS_PER_DAY)
      result = `${days} days until end`
    } else if (timeLeft > MILLISECONDS_PER_HOUR) {
      const hours = Math.ceil(timeLeft / MILLISECONDS_PER_HOUR)
      result = `${hours} hours until end`
    } else {
      const minutes = Math.ceil(timeLeft / MILLISECONDS_PER_MINUTE)
      result = `${minutes} minutes until end`
    }
  }

  // Cache the result (limit cache size to prevent memory leaks)
  if (timeCalculationCache.size > 100) {
    const firstKey = timeCalculationCache.keys().next().value
    timeCalculationCache.delete(firstKey)
  }
  timeCalculationCache.set(cacheKey, result)

  return result
}

export const formatDate = (date: Date) => {
  // Create cache key for this date
  const cacheKey = date.getTime().toString()

  // Check cache first
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey)!
  }

  // Use more efficient date formatting
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are 0-based in JavaScript
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  // Use utility function for consistent formatting
  const result = `${formatDateComponent(day)}.${formatDateComponent(month)}.${year} @ ${formatDateComponent(hours)}:${formatDateComponent(minutes)}`

  // Cache the result (limit cache size to prevent memory leaks)
  if (dateFormatCache.size > 100) {
    const firstKey = dateFormatCache.keys().next().value
    dateFormatCache.delete(firstKey)
  }
  dateFormatCache.set(cacheKey, result)

  return result
}

export const formatDateLocale = (date: Date) => {
  // Create cache key for this date
  const cacheKey = `locale_${date.getTime().toString()}`

  // Check cache first
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey)!
  }

  // Format the date more efficiently
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are 0-based in JavaScript
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  // Get the timezone offset more efficiently
  const timezoneOffset = -date.getTimezoneOffset() // In minutes
  const offsetHours = Math.floor(timezoneOffset / 60)
  const offsetMinutes = timezoneOffset % 60
  const offsetSign = timezoneOffset >= 0 ? "+" : "-"

  // Combine the formatted date with the timezone offset using utility function
  const result = `${formatDateComponent(day)}.${formatDateComponent(month)}.${year} @ ${formatDateComponent(hours)}:${formatDateComponent(minutes)} GMT${offsetSign}${formatDateComponent(offsetHours)}:${formatDateComponent(offsetMinutes)}`

  // Cache the result (limit cache size to prevent memory leaks)
  if (dateFormatCache.size > 100) {
    const firstKey = dateFormatCache.keys().next().value
    dateFormatCache.delete(firstKey)
  }
  dateFormatCache.set(cacheKey, result)

  return result
}

export const timeSince = (date: string) => {
  const now = new Date()
  const past = new Date(date)
  const secondsPast = Math.floor(
    (now.getTime() - past.getTime()) / MILLISECONDS_PER_SECOND
  )

  // Use constants for better performance
  if (secondsPast < 60) {
    return `${secondsPast} seconds ago`
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`
  }
  if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`
  }
  if (secondsPast <= 604800) {
    return `${Math.floor(secondsPast / 86400)} days ago`
  }
  return formatDate(past)
}

export const calculateBirthday = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${formatDateComponent(day)}.${formatDateComponent(month)}.${year}`
}
