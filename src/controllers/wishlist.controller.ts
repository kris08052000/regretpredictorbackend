import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../prisma.js";


export async function addToWishlist(req: Request, res: Response, next: NextFunction){
    try{
        const user = (req as AuthRequest).user;
        const {itemName, price, link} = req.body;
        const item = await prisma.wishlistItem.create({
            data: {userId: user!.id, itemName, price: price ?? null, link: link ?? null}
        })
        res.status(201).json({item});
    }catch(err){
        next(err);
    }
}

export async function listWishlist(req: Request, res: Response, next: NextFunction){
    try{
        const user = (req as AuthRequest).user;
        const items = await prisma.wishlistItem.findMany({
            where: { userId: user!.id},
            orderBy: {addedAt: "desc"}
        });
        res.json({items});
    }catch(err){
        next(err);
    }
}