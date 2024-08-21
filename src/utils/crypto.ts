import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const key = process.env.SECRET_KEY;

/**
 * Generate a random hash string.
 * @returns A hex string of 24 characters representing the hash
 */
export function createHash(): string {
  // Generate 12 random bytes and convert them to a hex string
  return crypto.randomBytes(12).toString("hex");
}

/**
 * Encrypt a message using AES-256-CBC encryption.
 * @param message - The plaintext message to encrypt
 * @returns The encrypted message encoded in base64 with the IV appended
 */
export function encryptMessage(message: string): string {
  // Generate a new initialization vector (IV) for each encryption
  const iv = crypto.randomBytes(16);
  
  // Create a cipher instance using AES-256-CBC with the provided key and IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(String(key), "hex"),  // Convert the key from hex to a Buffer
    iv
  );

  // Encrypt the message, converting from utf8 to base64
  let encrypted = cipher.update(message, "utf8", "base64");
  encrypted += cipher.final("base64");
  
  // Append the IV (encoded in hex) to the end of the encrypted message
  encrypted += iv.toString("hex");

  return encrypted;  // Return the encrypted message
}

/**
 * Decrypt a previously encrypted message.
 * @param ciphertext - The encrypted message with IV appended
 * @returns The decrypted plaintext message
 */
export function decryptMessage(ciphertext: string) {
  // Extract the IV from the end of the ciphertext (last 32 hex characters)
  const iv = Buffer.from(ciphertext.slice(ciphertext.length - 32), "hex");
  
  // Extract the encrypted text (everything before the IV)
  const encryptedText = Buffer.from(
    ciphertext.slice(0, ciphertext.length - 32),
    "base64"
  );

  // Create a decipher instance using AES-256-CBC with the provided key and IV
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(String(key), "hex"),  // Convert the key from hex to a Buffer
    iv
  );

  // Decrypt the encrypted text, converting from base64 to utf8
  let decrypted = decipher.update(encryptedText).toString("utf8");
  decrypted += decipher.final("utf8");

  return decrypted;  // Return the decrypted plaintext message
}
