type SecretPayload = {
    secret: string;
    expiresIn: number;
    expiresAfter: number;
}

type Secret = {
    hash: string;
    secretText: string;
    createdAt: string;
    expiresAt: string;
    remainingViews: number;
}

export { SecretPayload, Secret };

