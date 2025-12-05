import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../prisma.js";
import { getRegretScore } from "../services/ai.service.js";

export async function createPrediction(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as AuthRequest).user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const { itemName, price } = (req as any).validated;

        const ai = await getRegretScore(itemName, price);

        const prediction = await prisma.regretPrediction.create({
            data: {
                userId: user.id,
                itemName,
                price,
                regretScore: Number(ai.regretScore) || 0,
                reasons: ai.reasons || "No reasons generated"
            }
        });

        if (Array.isArray(ai.alternatives) && ai.alternatives.length > 0) {
            const altData = ai.alternatives.map((a: any) => ({
                predictionId: prediction.id,
                name: a.name || "",
                price: Number(a.price) || 0,
                link: a.link || "",
                description: a.description || ""
            }));

            await prisma.alternative.createMany({ data: altData });
        }

        const full = await prisma.regretPrediction.findUnique({
            where: { id: prediction.id },
            include: { alternatives: true }
        });

        res.status(201).json({ prediction: full });

    } catch (err) {
        next(err);
    }
}

export async function listPredictions(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as AuthRequest).user;
        const list = await prisma.regretPrediction.findMany({
            where: { userId: user!.id },
            orderBy: { createdAt: "desc" },
            include: { alternatives: true }
        });
        res.json({ data: list });
    } catch (err) {
        next(err);
    }
}