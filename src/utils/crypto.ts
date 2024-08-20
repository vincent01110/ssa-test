import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const key = process.env.SECRET_KEY;

export function createHash(): string {
  return crypto.randomBytes(12).toString("hex");
}

export function encryptMessage(message: string): string {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(String(key), "hex"),
    iv
  );
  let encrypted = cipher.update(message, "utf8", "base64");
  encrypted += cipher.final("base64");
  encrypted += iv.toString("hex");

  return encrypted;
}

export function decryptMessage(ciphertext: string) {
  const iv = Buffer.from(ciphertext.slice(ciphertext.length - 32), "hex");

  const encryptedText = Buffer.from(
    ciphertext.slice(0, ciphertext.length - 32),
    "base64"
  );
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(String(key), "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText).toString("base64");
  decrypted += decipher.final("utf8");

  return decrypted;
}
