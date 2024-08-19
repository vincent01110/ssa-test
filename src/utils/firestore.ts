import { Secret, SecretPayload } from "../types/types.js";
import db from "./firebase-config.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Query,
  updateDoc,
  doc,
} from "firebase/firestore";
import dotenv from "dotenv";
import { isExpired, secretPayloadToSecret } from "./utils.js";

dotenv.config();

export async function saveSecret(
  secretPayload: SecretPayload
): Promise<string> {
  const secret = secretPayloadToSecret(secretPayload);

  const collectionRef = collection(db, "secret");
  const doc = await addDoc(collectionRef, secret);

  if (doc.id) {
    return `${process.env.API_URL}/secret/${secret.hash}`;
  } else {
    throw new Error("Error adding data");
  }
}

export async function getSecret(hash: string): Promise<Secret | null> {
  const collectionRef = collection(db, "secret");
  const q = query(collectionRef, where("hash", "==", hash));
  const docs = await getDocs(q);
  if (docs.empty) {
    return null;
  }
  const secret = docs.docs[0].data() as Secret;

  if (isExpired(secret.expiresAt) || secret.remainingViews < 1) return null;

  const updatedSecret = updateSecret(secret, docs.docs[0].id);
  return updatedSecret;
}

export async function updateSecret(secret: Secret, id: string) {
  const docRef = doc(db, "secret", id);
  await updateDoc(docRef, { remainingViews: secret.remainingViews - 1 });
  return { ...secret, remainingViews: secret.remainingViews - 1 };
}
