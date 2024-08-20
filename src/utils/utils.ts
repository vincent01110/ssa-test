import { Secret, SecretPayload } from "../types/types.js";
import { createHash } from "./crypto.js";

export function validateSecretPayload(secretPayload: SecretPayload) {
  if (!secretPayload.secret) {
    throw new Error("Secret not defined!");
  }
  if (!secretPayload.expiresAfter) {
    throw new Error("Secret experiation time not defined!");
  }
  if (!secretPayload.expiresAfterViews) {
    throw new Error("Secret max lookup not defined!");
  }
  if (+secretPayload.expiresAfterViews < 1) {
    throw new Error("Max lookup must be greater than 0!");
  }
}

export function secretPayloadToSecret(secretPayload: SecretPayload): Secret {
  const hash: string = createHash();
  const now = new Date();
  const secret: Secret = {
    hash: hash,
    secretText: secretPayload.secret,
    createdAt: now.toLocaleString(),
    expiresAt: getExpiryDate(secretPayload.expiresAfter),
    remainingViews: secretPayload.expiresAfterViews,
  };
  return secret;
}

function getExpiryDate(expiresAfter: number): string {
  if (+expiresAfter === 0) {
    return "never";
  } else {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + expiresAfter * 60000);
    return expiryDate.toLocaleString();
  }
}

export function isExpired(expiryDate: string): boolean {
  if (expiryDate == "never") return false;
  const date = new Date();
  const now = date.toLocaleString();
  return Date.parse(expiryDate) < Date.parse(now);
}
