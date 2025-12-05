import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export default function Validate(schema: ZodType<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "validation error",
                errors: result.error.issues,
            });
        }

        (req as any).validated = result.data;
        next();
    };
}