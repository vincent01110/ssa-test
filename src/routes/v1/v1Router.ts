import express, { Router } from "express";
import secretRouter from "./routes/secretRoute.js";

const v1Router: Router = express.Router();

v1Router.use("/secret",secretRouter);


export default v1Router;