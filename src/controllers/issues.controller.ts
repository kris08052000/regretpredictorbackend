import { NextFunction, Request, Response } from "express";
import {prisma} from "../prisma.js";
import { AuthRequest } from "../middleware/auth.js";

export async function createIssue(req: Request, res: Response, next: NextFunction){
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
    try{
        const user = (req as AuthRequest).user;
        if(!user) return res.status(401).json({message: "Unauthorized"})

        const {title, description, priority, category, generatedIssueId, timestamp, userEmail} = req.body;

        // Your Discord webhook URL
        const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

        if (!DISCORD_WEBHOOK_URL) {
      return res.status(500).json({ message: "Discord webhook not configured" });
    }

// Priority emoji and color - ADD TYPE ASSERTIONS
const priorityEmoji = {
  low: "🟢",
  medium: "🟡",
  high: "🔴"
}[priority as "low" | "medium" | "high"];

const priorityColor = {
  low: 3066993,    // Green
  medium: 16776960, // Yellow
  high: 15158332    // Red
}[priority as "low" | "medium" | "high"];

const categoryEmoji = {
  bug: "🐛",
  feature: "✨",
  improvement: "🚀",
  other: "💬"
}[category as "bug" | "feature" | "improvement" | "other"];

    // Create Discord embed
    const discordPayload = {
      embeds: [
        {
          title: `${categoryEmoji} ${title}`,
          description: description,
          color: priorityColor,
          fields: [
            {
              name: "Issue ID",
              value: `\`${generatedIssueId}\``,
              inline: true
            },
            {
              name: "Priority",
              value: `${priorityEmoji} ${priority.toUpperCase()}`,
              inline: true
            },
            {
              name: "Category",
              value: `${categoryEmoji} ${category}`,
              inline: true
            },
            {
              name: "Reported By",
              value: userEmail,
              inline: true
            },
            {
              name: "Status",
              value: "🔵 Open",
              inline: true
            },
            {
              name: "Timestamp",
              value: new Date(timestamp).toLocaleString(),
              inline: true
            }
          ],
          footer: {
            text: "Regret Predictor Issue Tracker"
          },
          timestamp: timestamp
        }
      ]
    };

    // Send to Discord
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
    console.error("Discord webhook failed with status:", discordResponse.status);
    }

    const issue = await prisma.issue.create({
        data : {
            userId : user.id,
            generatedIssueId,
            title,
            description,
            priority: priority.toUpperCase(),
            category: category.toUpperCase(),
            timestamp,
            userEmail
        }
    })

    res.status(201).json({issue, message: "Issue reported successfully"});

    }catch(err){
        //next(err);
        console.error("Error submitting issue:", err);
        //res.status(500).json({ message: "Failed to submit issue" });
    }
}