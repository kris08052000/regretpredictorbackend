import { Request, Response, NextFunction } from "express";
import { verifyToken} from "../utils/token.js";

export interface AuthRequest extends Request{
    user?: {id: number; email?: string};
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const header = req.headers.authorization;
        if(!header || !header.startsWith("Bearer ")){
            return res.status(401).json({ message: "Authorization token required" })
        }
        const token = header.split(" ")[1] as string;
        const decoded = verifyToken(token);
        // minimal user info
        req.user = {id: Number(decoded.id), email: decoded.email}
        next();
    }catch(err){
    return res.status(401).json({ message: "Invalid or expired token" });    
    }
}