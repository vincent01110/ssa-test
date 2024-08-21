import { Secret, SecretPayload } from "../types/types.js";
import db from "../configs/firebase-config.js";
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
import { decryptMessage, encryptMessage } from "./crypto.js";

dotenv.config();


/**
 * Save a new secret to Firestore after encrypting its text.
 * @param secretPayload - The payload containing the secret to save
 * @returns The saved Secret object with encrypted text
 * @throws Error if there's an issue adding the document
 */
export async function saveSecret(
  secretPayload: SecretPayload
): Promise<Secret> {
  // Convert the SecretPayload to a Secret object
  const secret = secretPayloadToSecret(secretPayload);
  
  // Encrypt the secret text before saving
  secret.secretText = encryptMessage(secret.secretText);
  
  // Get a reference to the "secret" collection
  const collectionRef = collection(db, "secret");
  
  // Add the new secret document to the collection
  const docRef = await addDoc(collectionRef, secret);
  
  // Check if the document was successfully added
  if (docRef.id) {
    return secret as Secret;
  } else {
    throw new Error("Error adding data!");  // Throw an error if adding the document fails
  }
}

/**
 * Retrieve a secret by its hash from Firestore and check if it is still valid.
 * @param hash - The hash of the secret to retrieve
 * @returns The Secret object if found and valid, or null if not found or expired
 */
export async function getSecret(hash: string): Promise<Secret | null> {
  // Get a reference to the "secret" collection
  const collectionRef = collection(db, "secret");
  
  // Create a query to find the document with the specified hash
  const q = query(collectionRef, where("hash", "==", hash));
  
  // Execute the query
  const docs = await getDocs(q);
  
  // Return null if no documents match the query
  if (docs.empty) {
    return null;
  }
  
  // Get the first matching document
  const secret = docs.docs[0].data() as Secret;
  
  // Check if the secret is expired or out of views
  if (isExpired(secret.expiresAt) || secret.remainingViews < 1) {
    // Delete the expired or invalid secret
    await deleteSecret(docs.docs[0].id);
    return null;
  }
  
  // Update the secret's view count and decrypt its text
  const updatedSecret = await updateSecret(secret, docs.docs[0].id);
  return updatedSecret;
}

/**
 * Update the secret's view count and decrypt its text.
 * @param secret - The Secret object to update
 * @param id - The Firestore document ID of the secret
 * @returns The updated Secret object with decremented views and decrypted text
 */
async function updateSecret(secret: Secret, id: string): Promise<Secret> {
  // Get a reference to the specific document in the "secret" collection
  const docRef = doc(db, "secret", id);
  
  // Update the document to decrement the remaining views
  await updateDoc(docRef, { remainingViews: secret.remainingViews - 1 });
  
  // Decrypt the secret text
  secret.secretText = decryptMessage(secret.secretText);
  
  // Return the updated secret with decremented views
  return { ...secret, remainingViews: secret.remainingViews - 1 } as Secret;
}

/**
 * Delete a secret document from Firestore.
 * @param id - The Firestore document ID of the secret to delete
 */
async function deleteSecret(id: string) {
  // Get a reference to the specific document in the "secret" collection
  const docRef = doc(db, "secret", id);
  
  // Delete the document
  await deleteDoc(docRef);
}