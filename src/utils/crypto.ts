import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config()

export function createHash(): string {
  return crypto.randomBytes(12).toString("hex");
}
