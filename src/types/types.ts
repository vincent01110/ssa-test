type SecretPayload = {
    secret: string;
    expiresAfter: number;
    expiresAfterViews: number;
}


type Secret = {
    hash: string;
    secretText: string;
    createdAt: string;
    expiresAt: string;
    remainingViews: number;
}

export { SecretPayload, Secret };

