import express, { Express, Request, Response } from "express";
import cors from "cors";
import { SecretPayload } from "./types/types.js";
import { saveSecret } from "./utils/firestore.js";
import xml from "xml";
import { validateSecretPayload } from "./utils/utils.js";
import bodyParser from "body-parser";

const app: Express = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const contentType = req.headers['content-type'];
  
  if (contentType !== 'application/x-www-form-urlencoded') {
      return res.status(415).send('Unsupported Content Type');
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
    
    try{
      validateSecretPayload(secret)
    } catch(error:any){
      console.error(error);
      res.status(405).send(error.message);
    }

    const result = await saveSecret(secret);

    const accept = req.accepts(["json", "xml"]);

    if (accept === "json") {
      res.json({ secret: result });
    } else if (accept === "xml") {
      const xmlData = xml({ secret: result });

      res.type("application/xml");
      res.send(xmlData);
    } else {
      res.status(405).send("Not Acceptable");
    }
  } catch (error: any) {
    console.error("Error fetching:", error);
    res.status(500).json({ error: "Failed to fetch", message: error.message});
  }
});


app.get("/secret/:hash", async (req: Request, res: Response) => {

})

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
