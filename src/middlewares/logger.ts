import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toLocaleString();

    console.log(`[${timestamp}] ${method} ${url}`);

    next();
};

export default loggerMiddleware;