import express, { Router } from "express";
import { createSecret, getSecretByHash } from "../../../controllers/secretController.js";


const secretRouter: Router = express.Router();

secretRouter.post("/", createSecret);
  
secretRouter.get("/:hash", getSecretByHash);


export default secretRouter;