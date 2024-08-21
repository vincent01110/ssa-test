import { Request, Response } from "express";
import { SecretPayload } from "../types/types.js";
import { validateSecretPayload } from "../utils/utils.js";
import { saveSecret, getSecret } from "../utils/firestore.js";
import xml2js from "xml2js";

export const createSecret = async (req: Request, res: Response) => {
    try {
        const secret = req.body as SecretPayload;
    
        try {
          validateSecretPayload(secret);
        } catch (error: any) {
          res.status(405).send(error.message);
          return;
        }
    
        const result = await saveSecret(secret);
    
        const accept = req.accepts(["json", "xml"]);
    
        if (accept === "json") {
          res.json(result);
        } else if (accept === "xml") {
          const builder = new xml2js.Builder({
            headless: false,
            renderOpts: { pretty: true },
          });
          const xmlData = builder.buildObject({ Secret: { ...result } });
    
          res.type("application/xml");
          res.send(xmlData);
        } else {
          res.status(405).send("Not Acceptable");
        }
      } catch (error: any) {
        console.error("Error fetching:", error);
        res.status(500).json({ error: "Failed to fetch", message: error.message });
      }
};

export const getSecretByHash = async (req: Request, res: Response) => {
    try {
        const { hash } = req.params;
    
        const secret = await getSecret(hash);
    
        const accept = req.accepts(["json", "xml"]);
    
        if (accept === "json") {
          if (!secret) {
            res.status(404).json("Secret not found!");
          } else {
            res.json(secret);
          }
        } else if (accept === "xml") {
          let xmlData = null;
          if (!secret) {
            xmlData = "Secret not found!";
            res.type("application/xml");
            res.status(404).send(xmlData);
          } else {
            const builder = new xml2js.Builder({
              headless: false,
              renderOpts: { pretty: true },
            });
            xmlData = builder.buildObject({ Secret: { ...secret } });
            res.type("application/xml");
            res.send(xmlData);
          }
        } else {
          res.status(405).send("Not Acceptable");
        }
      } catch (error: any) {
        console.error("Error fetching:", error);
        res.status(500).json({ error: "Failed to fetch", message: error.message });
      }
}