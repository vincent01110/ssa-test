import { NextFunction } from "express";
import type { Request, Response } from "firebase-functions";


export const headerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers["content-type"];
    
    if (contentType !== "application/x-www-form-urlencoded") {
      return res.status(415).json("Unsupported Content Type");
    }
    
    next();
}