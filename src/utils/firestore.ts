import db from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";

export async function saveSecret(secret: string, expiresIn: number, expiresAfter: number): Promise<string> {
    const collectionRef = collection(db, "secret");
    

    return "";
}
