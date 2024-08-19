import { Secret, SecretPayload } from "../types/types.js";
import db from "./firebase-config.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
import { isExpired, secretPayloadToSecret } from "./utils.js";

dotenv.config();

export async function saveSecret(
  secretPayload: SecretPayload
): Promise<Secret> {
  const secret = secretPayloadToSecret(secretPayload);

  const collectionRef = collection(db, "secret");
  const doc = await addDoc(collectionRef, secret);
  if (doc.id) {
    return secret as Secret;
  } else {
    throw new Error("Error adding data!");
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

  if (isExpired(secret.expiresAt) || secret.remainingViews < 1) {
    await deleteSecret(docs.docs[0].id);
    return null;
  }
  const updatedSecret = updateSecret(secret, docs.docs[0].id);
  return updatedSecret;
}

async function updateSecret(secret: Secret, id: string): Promise<Secret> {
  const docRef = doc(db, "secret", id);
  await updateDoc(docRef, { remainingViews: secret.remainingViews - 1 });
  return { ...secret, remainingViews: secret.remainingViews - 1 } as Secret;
}

async function deleteSecret(id: string) {
  const docRef = doc(db, "secret", id);
  await deleteDoc(docRef);
}
