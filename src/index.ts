import express, { Express, Request, Response } from "express";
import cors from "cors";
import { SecretPayload } from "./types/types.js";
import { saveSecret, getSecret } from "./utils/firestore.js";
import { validateSecretPayload } from "./utils/utils.js";
import bodyParser from "body-parser";
import xml2js from "xml2js";

const app: Express = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const contentType = req.headers["content-type"];

  if (contentType !== "application/x-www-form-urlencoded") {
    return res.status(415).send("Unsupported Content Type");
  }

  next();
});

const port = 8000;

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hi");
});

app.post("/secret", async (req: Request, res: Response) => {
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
});

app.get("/secret/:hash", async (req: Request, res: Response) => {
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
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
