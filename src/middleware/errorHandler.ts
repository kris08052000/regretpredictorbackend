import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction){
    console.error(err);
    if(process.env.NODE_ENV === "production"){
        return res.status(500).json({message: "Server error"});
    }
    return res.status(500).json({ message: err?.message ?? "Server error", stack: err?.stack });
}

