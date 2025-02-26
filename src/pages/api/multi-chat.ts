import { openai } from "@/config";
import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/utils/redis";  
import crypto from "crypto";

interface TokenData {
  address: string;
  symbol: string;
  supply: string;
  market_cap: number;
  price: number;
  priceChange24h?: number;
  volume24h?: number;
}

interface ProcessedToken {
  symbol: string;
  marketCap: number;
  price: number;
  priceChange: number;
  supply: string;
}

const parseMarketCap = (marketCap: string | null | undefined): number => {
  if (!marketCap) return 0;
  return parseFloat(marketCap.replace(/,/g, ''));
};
function generateCacheKey(message: string, tokenSummary: ProcessedToken[]): string {
  const keyData = message + JSON.stringify(tokenSummary);
  return "openai_" + crypto.createHash("md5").update(keyData).digest("hex");
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { message, tokens } = req.body as {
      message: string;
      tokens: TokenData[];
    };

    if (!message || !Array.isArray(tokens)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const tokenSummary: ProcessedToken[] = tokens.slice(0, 50).map(token => ({
      symbol: token.symbol,
      marketCap: token.market_cap || 0,
      price: token.price,
      priceChange: token.priceChange24h || 0,
      supply: token.supply
    }));

    const validTokens = tokenSummary.filter(t => t.marketCap > 0);

    const totalMarketCap = validTokens.reduce((sum, t) => sum + t.marketCap, 0);

    const totalPrice = validTokens.reduce((sum, t) => sum + t.price, 0);
    const averagePrice = validTokens.length > 0
      ? totalPrice / validTokens.length
      : 0;

    const marketCapData = [...validTokens]
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 5);

    const pricePerformers = [...validTokens]
      .sort((a, b) => (b.priceChange || 0) - (a.priceChange || 0))
      .slice(0, 5);

      const systemPrompt = `
      You are a cryptocurrency analysis expert. Analyze this token data:
      
      **Total Tokens:** ${tokens.length}
      
      **Key Metrics:**
      - Average Price: $${averagePrice.toFixed(4)}
      - Total Market Cap: $${totalMarketCap.toLocaleString()}
      
      **Top Market Cap Tokens:**
      ${marketCapData.map(t => `- ${t.symbol}: $${t.marketCap.toLocaleString()}`).join('\n')}
      
      **Top Price Performers:**
      ${pricePerformers.map(t => `- ${t.symbol}: ${t.priceChange.toFixed(2)}%`).join('\n')}
      
      **Response Rules:**
      1. Use Markdown formatting for tables/lists
      2. Highlight important numbers in **bold**
      3. Compare tokens using available metrics
      4. NEVER provide financial advice or recommendations
      5. When discussing investment factors:
         - Present both positive and negative indicators
         - Explain market cap implications
         - Analyze price trends and volume
         - Compare to similar tokens
      6. For "should I buy/sell" questions:
         - List relevant metrics
         - Explain potential implications
         - State "This is not a recommendation"
         - Add disclaimer about personal research
      7. For unavailable data: "Data not available"
      8. Format prices to 4 decimals, market caps with commas
      9. Use professional terminology but remain accessible
      10. Final paragraph must include:
          "Remember: Cryptocurrency investments carry risk. 
          This analysis is informational only. Always conduct 
          your own research or consult a financial advisor 
          before making investment decisions."
    `;

    const cacheKey = generateCacheKey(message, tokenSummary);

    // Check if we already have a cached OpenAI response
    let cachedResponse = await redis.get(cacheKey);
    if (cachedResponse) {
      return res.status(200).json({ reply: formatResponse(cachedResponse) });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';
    res.status(200).json({ reply: formatResponse(response) });

  } catch (error) {
    console.error("Error in multi-chat:", error);
    res.status(500).json({
      error: process.env.NODE_ENV === 'development'
        ? (error as Error).message
        : "Internal Server Error"
    });
  }
}
const formatResponse = (text: string): string => {
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br />');

  formattedText = formattedText.replace(
    /(\|.*\|)\n(\|.*\|)\n((\|.*\|\n)*)/g,
    (match, headerRow, separatorRow, dataRows) => {
      interface TableCell {
        content: string;
        raw: string;
      }

      const headers: string = headerRow
        .split('|')
        .filter((cell: string): boolean => cell.trim() !== '')
        .map((cell: string): string => `<th>${cell.trim()}</th>`)
        .join('');

      interface TableRow {
        cells: string;
        raw: string;
      }

      interface TableCell {
        content: string;
      }

            const rows: string = dataRows
              .split('\n')
              .filter((row: string): boolean => row.trim() !== '')
              .map((row: string): string => {
                const cells: string = row
                  .split('|')
                  .filter((cell: string): boolean => cell.trim() !== '')
                  .map((cell: string): string => `<td>${cell.trim()}</td>`)
                  .join('');
                return `<tr>${cells}</tr>`;
              })
              .join('');

      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  formattedText = formattedText.replace(
    /(<li>.*<\/li>)/g,
    (match) => `<ul>${match}</ul>`
  );

  formattedText = formattedText
    .replace(/<\/h2>/g, '</h2><br />')
    .replace(/<\/h3>/g, '</h3><br />')
    .replace(/<\/table>/g, '</table><br />')
    .replace(/<\/ul>/g, '</ul><br />');

  return formattedText;
};