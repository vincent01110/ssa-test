import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Secret } from "./types/types.js";
import { saveSecret } from "./utils/firestore.js";
import xml from "xml";

const app: Express = express();

app.use(cors());
app.use(express.json());

const port = 8000;

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hi");
});

app.post("/secret", async (req: Request, res: Response) => {
  try {
    const secret = req.body as Secret;
    const result = await saveSecret(secret);

    const accept = req.accepts(["json", "xml"]);

    if (accept === "json") {
      res.json({ secret: result });
    } else if (accept === "xml") {
      const xmlData = xml({ secret: result });

      res.type("application/xml");
      res.send(xmlData);
    } else {
      res.status(406).send("Not Acceptable");
    }
  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
