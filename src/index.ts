import express, { Express, Request, Response, Router } from "express";
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing
import bodyParser from "body-parser"; // Middleware to parse incoming request bodies
import functions from "firebase-functions"; // Firebase Functions SDK
import v1Router from "./routes/v1/v1Router.js"; // Import custom router for API v1
import { headerMiddleware } from "./middlewares/header.js"; // Import custom middleware for headers
import loggerMiddleware from "./middlewares/logger.js"; // Import custom logging middleware

// Initialize an Express application
const app: Express = express();

// Define the port to listen on; default to 3000 if not specified
const port = process.env.PORT || 3000;

// Use middleware to handle Cross-Origin requests
app.use(cors());

// Use body-parser middleware to parse URL-encoded data with extended option
app.use(bodyParser.urlencoded({ extended: true }));

// Use custom middleware for setting headers
app.use(headerMiddleware);

// Use custom middleware for logging requests
app.use(loggerMiddleware);

// Mount the v1Router at the /v1 path
app.use("/v1", v1Router);

// Define a simple route to respond with "Hi" to GET requests at /hello
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hi");
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log("Listening on port: " + port);
});
