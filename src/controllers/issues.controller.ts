import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../middleware/auth.js";
import axios from "axios";

export async function createIssue(req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  try {
    const user = (req as AuthRequest).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, priority, category, userEmail } = req.body;

    // Generate Issue ID HERE (not from frontend)
    const generatedIssueId = `RPR-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    // Your Discord webhook URL
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      return res.status(500).json({ message: "Discord webhook not configured" });
    }

    // Priority emoji and color
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

    // Send to Discord - FIX: Don't wrap payload in another object
    const discordResponse = await axios.post(
      DISCORD_WEBHOOK_URL,
      discordPayload,  // Send payload directly, not wrapped
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (discordResponse.status !== 204 && discordResponse.status !== 200) {
      throw new Error("Failed to send to Discord");
    }

    // Save to database
    const issue = await prisma.issue.create({
      data: {
        userId: user.id,
        generatedIssueId: generatedIssueId,
        title,
        description,
        priority: priority.toUpperCase(),
        category: category.toUpperCase(),
        timestamp: timestamp,
        userEmail
      }
    });

    // Return the issue ID to frontend
    res.status(201).json({ 
      issue, 
      issueId: generatedIssueId,  // Send this to frontend
      message: "Issue reported successfully" 
    });

  } catch (err: any) {
    console.error("Error submitting issue:", err);
    
    // Better error logging for Discord
    if (err.response) {
      console.error("Discord API Error:", err.response.data);
    }
    
    // Don't call both next() and res.json()
    res.status(500).json({ message: "Failed to submit issue" });
  }
}