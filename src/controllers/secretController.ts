import { Request, Response } from "express";
import { SecretPayload } from "../types/types.js";
import { validateSecretPayload } from "../utils/utils.js";
import { saveSecret, getSecret } from "../utils/firestore.js";
import xml2js from "xml2js";

// Handler to create a new secret
export const createSecret = async (req: Request, res: Response) => {
    try {
        // Extract the secret payload from the request body and cast to SecretPayload type
        const secret = req.body as SecretPayload;
    
        try {
            validateSecretPayload(secret);
        } catch (error: any) {
            // If validation fails, send a 405 Method Not Allowed status with error message
            res.status(405).send(error.message);
            return;
        }
    
        // Save the secret to Firestore
        const result = await saveSecret(secret);

        const accept = req.accepts(["json", "xml"]);
    
        if (accept === "json") {
            // If JSON is accepted, respond with the result as JSON
            res.json(result);
        } else if (accept === "xml") {
            // If XML is accepted, convert result to XML format
            const builder = new xml2js.Builder({
                headless: false,  // Include XML declaration
                renderOpts: { pretty: true },  // Format XML for readability
            });
            const xmlData = builder.buildObject({ Secret: { ...result } });
    
            // Set the response type to XML and send the XML data
            res.type("application/xml");
            res.send(xmlData);
        } else {
            // If neither JSON nor XML is acceptable, send a 405 Method Not Allowed status
            res.status(405).send("Not Acceptable");
        }
    } catch (error: any) {
        console.error("Error fetching:", error);
        res.status(500).json({ error: "Failed to fetch", message: error.message });
    }
};

// Handler to retrieve a secret by its hash
export const getSecretByHash = async (req: Request, res: Response) => {
    try {
        // Extract the hash from request parameters
        const { hash } = req.params;
    
        // Retrieve the secret from Firestore using the hash
        const secret = await getSecret(hash);
    
        // Determine the acceptable response formats based on the request's Accept header
        const accept = req.accepts(["json", "xml"]);
    
        if (accept === "json") {
            if (!secret) {
                // If the secret is not found, respond with a 404 Not Found status and message
                res.status(404).json("Secret not found!");
            } else {
                // If the secret is found, respond with the secret as JSON
                res.json(secret);
            }
        } else if (accept === "xml") {
            let xmlData: string;
            if (!secret) {
                // If the secret is not found, send a 404 Not Found status with an error message in XML format
                xmlData = "Secret not found!";
                res.type("application/xml");
                res.status(404).send(xmlData);
            } else {
                // If the secret is found, convert it to XML format
                const builder = new xml2js.Builder({
                    headless: false,  // Include XML declaration
                    renderOpts: { pretty: true },  // Format XML for readability
                });
                xmlData = builder.buildObject({ Secret: { ...secret } });
                res.type("application/xml");
                res.send(xmlData);
            }
        } else {
            // If neither JSON nor XML is acceptable, send a 405 Method Not Allowed status
            res.status(405).send("Not Acceptable");
        }
    } catch (error: any) {
        // Handle unexpected errors
        console.error("Error fetching:", error);
        res.status(500).json({ error: "Failed to fetch", message: error.message });
    }
}