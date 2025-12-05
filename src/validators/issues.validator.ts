import z from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["bug", "feature", "improvement", "other"]),
  userEmail: z.string().min(6),
});