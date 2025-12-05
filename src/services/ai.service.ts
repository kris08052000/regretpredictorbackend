import { groq } from "../lib/groq.js";
import fs from "fs";
import path from "path";

const systemPrompt = fs.readFileSync(
    path.join(process.cwd(), "prompts", "regretPrompt.txt"),
    "utf8"
);



export async function getRegretScore(itemName: string, price: number) {
    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0.3,
        max_tokens: 1000,
        top_p: 1,
        stream: false,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Item: ${itemName} Price: ${price}`}
        ]
    });

    const raw = completion.choices[0]?.message?.content || "";
    console.log("RAW AI OUTPUT:", raw);

    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error("JSON parse failed:", raw);
        return {
            regretScore: 0,
            reasons: "AI returned invalid JSON",
            alternatives: []
        };
    }
}