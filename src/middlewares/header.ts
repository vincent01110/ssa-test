import { NextFunction } from "express";
import type { Request, Response } from "firebase-functions";

// Define the header middleware function
export const headerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the "content-type" header from the request
    const contentType = req.headers["content-type"];
    
    // Check if the content-type is not "application/x-www-form-urlencoded"
    if (contentType !== "application/x-www-form-urlencoded") {
        // If content-type is not supported, send a 415 Unsupported Media Type status with an error message
        return res.status(415).json("Unsupported Content Type");
    }
    
    // If content-type is supported, proceed to the next middleware or route handler
    next();
}