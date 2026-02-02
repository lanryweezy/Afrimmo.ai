// Utility functions for the application

/**
 * Formats currency values for display
 * @param amount The numeric amount to format
 * @param currency The currency code (default: NGN)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats dates in a readable format
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = {}): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }).format(dateObj);
};

/**
 * Debounces a function call
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
};

/**
 * Validates email format
 * @param email The email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generates a random ID
 * @param length Length of the ID to generate
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Checks if the current environment is production
 * @returns Boolean indicating if in production
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Safely parses JSON string
 * @param jsonString The JSON string to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed object or default value
 */
export const safeJsonParse = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};