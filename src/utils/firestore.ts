import { Secret } from "../types/types.js";
import db from "./firebase-config.js";
import { collection, addDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

export async function saveSecret(secret: Secret): Promise<string>{
    const collectionRef = collection(db, "secret");
    const doc = await addDoc(collectionRef, secret);
    
    return `${process.env.API_URL}/secret/${doc.id}`;
}
