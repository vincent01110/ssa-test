import crypto from "crypto";

export function createHash(): string{
    return crypto.randomBytes(12).toString("hex");
}