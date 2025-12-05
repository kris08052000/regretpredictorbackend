import z from "zod";

export const createIssueSchema = z.object({
  generatedIssueId: z.string().max(10),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["bug", "feature", "improvement", "other"]),
  timestamp: z.string().min(1),
  userEmail: z.string().min(6),
});