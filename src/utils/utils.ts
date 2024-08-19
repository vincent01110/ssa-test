import { Secret, SecretPayload } from "../types/types.js";
import { createHash } from "./crypto.js";

export function validateSecretPayload(secretPayload: SecretPayload) {
  if (!secretPayload.secret) {
    throw new Error("Secret not defined!");
  }
  if (!secretPayload.expiresIn) {
    throw new Error("Secret experiation time not defined!");
  }
  if (!secretPayload.expiresAfter) {
    throw new Error("Secret max lookup not defined!");
  }
}

export function secretPayloadToSecret(secretPayload: SecretPayload): Secret {
  const hash: string = createHash();
  const now = new Date();
  const secret: Secret = {
    hash: hash,
    secretText: secretPayload.secret,
    createdAt: now.toLocaleString(),
    expiresAt: getExpiryDate(secretPayload.expiresIn),
    remainingViews: secretPayload.expiresAfter,
  };
  return secret;
}

function getExpiryDate(expiresIn: number): string {
  if (expiresIn === 0) {
    return "never";
  } else {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + expiresIn * 60000);
    return expiryDate.toLocaleString();
  }
}
