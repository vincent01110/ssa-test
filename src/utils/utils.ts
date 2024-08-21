import { Secret, SecretPayload } from "../types/types.js";
import { createHash } from "./crypto.js";

/**
 * Validate the secret payload to ensure all required fields are present and valid.
 * @param secretPayload - The payload to validate
 * @throws Error if any validation checks fail
 */
export function validateSecretPayload(secretPayload: SecretPayload) {
  // Check if the secret text is provided
  if (!secretPayload.secret) {
    throw new Error("Secret not defined!");
  }
  // Check if the expiration time is provided
  if (!secretPayload.expiresAfter) {
    throw new Error("Secret expiration time not defined!");
  }
  // Check if the maximum number of views is provided
  if (!secretPayload.expiresAfterViews) {
    throw new Error("Secret max lookup not defined!");
  }
  // Ensure the maximum number of views is greater than 0
  if (+secretPayload.expiresAfterViews < 1) {
    throw new Error("Max lookup must be greater than 0!");
  }
}

/**
 * Convert the SecretPayload to a Secret object, including generating a hash and calculating expiry date.
 * @param secretPayload - The payload to convert
 * @returns A Secret object with additional metadata
 */
export function secretPayloadToSecret(secretPayload: SecretPayload): Secret {
  // Generate a unique hash for the secret
  const hash: string = createHash();
  
  // Get the current date and time
  const now = new Date();
  
  // Create a Secret object with the necessary details
  const secret: Secret = {
    hash: hash,  // Unique identifier for the secret
    secretText: secretPayload.secret,  // The secret text
    createdAt: now.toLocaleString(),  // Creation timestamp
    expiresAt: getExpiryDate(secretPayload.expiresAfter),  // Expiration timestamp
    remainingViews: secretPayload.expiresAfterViews,  // Number of views remaining
  };
  
  return secret;
}

/**
 * Calculate the expiry date based on the current time and the expiration period.
 * @param expiresAfter - The number of minutes after which the secret expires
 * @returns A string representing the expiry date
 */
function getExpiryDate(expiresAfter: number): string {
  if (+expiresAfter === 0) {
    return "never";  // Special case where the secret does not expire
  } else {
    // Calculate the expiry date by adding the expiration period to the current time
    const now = new Date();
    const expiryDate = new Date(now.getTime() + expiresAfter * 60000);  // Convert minutes to milliseconds
    return expiryDate.toLocaleString();  // Return the expiry date as a string
  }
}

/**
 * Check if a given expiry date has passed.
 * @param expiryDate - The date to check
 * @returns True if the date is in the past, otherwise false
 */
export function isExpired(expiryDate: string): boolean {
  if (expiryDate === "never") return false;  // Special case where the secret does not expire
  // Compare the expiry date with the current date
  const now = new Date();
  return Date.parse(expiryDate) < Date.parse(now.toLocaleString());
}