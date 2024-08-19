import {  SecretPayload } from "../types/types.js";
import db from "./firebase-config.js";
import { collection, addDoc } from "firebase/firestore";
import dotenv from "dotenv";
import { secretPayloadToSecret } from "./utils.js";

dotenv.config();

export async function saveSecret(secretPayload: SecretPayload): Promise<string>{

    const secret = secretPayloadToSecret(secretPayload);

    const collectionRef = collection(db, "secret");
    const doc = await addDoc(collectionRef, secret);


    if(doc.id){
        return `${process.env.API_URL}/secret/${secret.hash}`;
    } else {
        throw new Error("Error adding data");
    }

}
