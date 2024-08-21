import { Request, Response, NextFunction } from "express";

// Define the logger middleware function
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the HTTP method (GET, POST, etc.) of the request
    const method = req.method;
    
    // Retrieve the URL of the request
    const url = req.url;
    
    // Get the current timestamp formatted as a locale string
    const timestamp = new Date().toLocaleString();

    console.log(`[${timestamp}] ${method} ${url}`);

    // Call the next middleware function in the stack
    next();
};

export default loggerMiddleware;