import { clsx } from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely handle response errors to prevent stream issues
 */
export function safeResponse<T>(
  response: T,
  errorMessage: string = "An error occurred"
): T {
  try {
    return response
  } catch (error) {
    console.error("Response error:", error)
    throw new Error(errorMessage)
  }
}

/**
 * Check if a response has already been sent
 */
export function isResponseSent(response: any): boolean {
  return response?.headersSent || response?.finished || false
}
