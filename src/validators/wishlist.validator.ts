import z from "zod";

export const addToWishlistSchema = z.object({
  itemName: z.string().min(1),
  price: z.number().int().nonnegative(),
  link: z.string().url().optional(),
});