import z from "zod";

export const createPurchaseSchema = z.object({
  itemName: z.string().min(1),
  price: z.number().int().nonnegative(),
  date: z.string().datetime(), // ISO string -> convert to Date in controller
  categoryId: z.number().int().optional(),
});