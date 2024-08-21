import express, { Express, Request, Response, Router } from "express";
import cors from "cors";
import { SecretPayload } from "./types/types.js";
import { saveSecret, getSecret } from "./utils/firestore.js";
import { validateSecretPayload } from "./utils/utils.js";
import bodyParser from "body-parser";
import xml2js from "xml2js";
import functions from "firebase-functions";
import v1Router from "./routes/v1/v1Router.js";
import { headerMiddleware } from "./middlewares/header.js";
import loggerMiddleware from "./middlewares/logger.js";

const app: Express = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(headerMiddleware);
app.use(loggerMiddleware);

app.use("/v1", v1Router);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hi");
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});

export const api = functions.https.onRequest(app);
