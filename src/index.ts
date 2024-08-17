import express, { Express, Request, Response } from "express";
import cors from "cors";
import db from "./utils/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const app: Express = express();

app.use(cors());

const port = 8000;

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hi");
});

app.get("/", async (req: Request, res: Response) => {
  try {
    const secrets = collection(db, "secret");
    const querySnapshot = await getDocs(secrets);

    // Extract data from documents
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id, // document ID
      ...doc.data(), // document data
    }));

    // Send the data as a response
    res.json(data);

    res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
