import {z} from "zod";

export const createPredictionSchema = z.object({
    itemName: z.string().min(1),
    price: z.number().nonnegative(),
    regretScore: z.number().min(0).max(100).optional(),
    reasons: z.string().optional(),
    alternatives: z.array(z.object({
        name: z.string().min(1),
        price: z.number().nonnegative(),
        link: z.string().url().optional(),
        description: z.string().optional()    
    })).optional()
});