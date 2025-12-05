import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../prisma.js";

export async function createPurchase(req: Request, res: Response, next: NextFunction){
    try{
        const user = (req as AuthRequest).user;
        const {itemName, price, date, categoryId} = req.body;
        const purchase = await prisma.purchase.create({
            data: {
                userId: user!.id,
                itemName,
                price,
                date: date ? new Date(date) : new Date(),
                categoryId: categoryId ?? null
            }
        });
        res.status(201).json({purchase});
    }catch(err){
        next(err);
    }
}

export async function listPurchases(req: Request, res: Response, next: NextFunction){
    try{
        const user = (req as AuthRequest).user;
        const purchase = await prisma.purchase.findMany({
            where: {userId: user!.id},
            orderBy: {date: "desc"},
            include: {category: true}
        });
        res.json({purchase})
    }catch(err){
        next(err);
    }
}