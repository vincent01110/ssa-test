import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Secret } from "./types/types.js";

const app: Express = express();

app.use(cors());

const port = 8000;

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hi");
});


app.post("/secret", async (req: Request, res: Response) => {
  try {
    const secret: Secret = req.body;

    res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});


app.listen(port, () => {
  console.log("Listening on port: " + port);
});
