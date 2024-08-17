import { SecretPayload } from "../types/types.js";


export function validateSecretPayload(secretPayload: SecretPayload){
    if(!secretPayload.secret){
        throw new Error("Secret not defined!")
    }
    if(!secretPayload.expiresIn){
        throw new Error("Secret experiation time not defined!")
    }
    if(!secretPayload.expiresAfter){
        throw new Error("Secret max lookup not defined!")
    }
}