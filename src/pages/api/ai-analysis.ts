import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query;
    console.log("calling me ?? hurray : ", type);
  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  let systemPrompt = "";

  switch (type) {
    case "portfolio":
      systemPrompt = `
        You are an AI-powered crypto portfolio manager. Analyze the user's portfolio and provide:
        1. Market trend predictions.
        2. Risk analysis for each asset.
        3. Suggestions for optimizing staking strategies.
        4. Best times to buy/sell based on historical data.
      `;
      break;
    case "security":
      systemPrompt = `
        You are an AI-powered crypto security scanner. Analyze the following:
        1. Detect scam tokens or rug pulls.
        2. Identify suspicious wallet activity.
        3. Highlight potential vulnerabilities in smart contracts.
      `;
      break;
    case "auditor":
      systemPrompt = `
        You are an AI-powered smart contract auditor. Analyze the provided smart contract and:
        1. Identify security vulnerabilities.
        2. Suggest improvements for secure deployment.
        3. Provide best practices for EVM and Solana contracts.
      `;
      break;
    case "investigator":
      systemPrompt = `
        You are an AI-powered blockchain investigator. Analyze the following:
        1. Track lost or stolen funds.
        2. Detect fraudulent on-chain activity.
        3. Provide forensic insights for law enforcement.
      `;
      break;
    case "token-economy":
      systemPrompt = `
        You are an AI-powered token economy optimizer. Analyze the tokenomics and suggest:
        1. Best supply models (fixed, deflationary, inflationary).
        2. Ideal staking/reward structures.
        3. Ways to improve liquidity and stability.
      `;
      break;
    default:
      return res.status(400).json({ error: "Invalid type" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Provide analysis based on the latest data." },
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || "No response generated";
    res.status(200).json({ reply: response });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}