import { openai } from "@/config";
import { NextApiRequest, NextApiResponse } from "next";

interface TokenData {
  address?: string;
  name?: string;
  symbol?: string;
  icon?: string;
  price?: number;
  marketCap?: number;
  supply?: number;
  priceChange24h?: number;
  volume24h?: number;
  creator?: string;
  createdTime?: number;
  description?: string;
  image?: string;
  activities?: {
    activityType: string;
    fromAddress: string;
    value: number;
    time: string;
  }[];
  priceHistory?: {
    date: number;
    price: number;
  }[];
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
      const headers: string = headerRow
        .split('|')
        .filter((cell: string) => cell.trim() !== '')
        .map((cell: string) => `<th class="px-4 py-2 border-b border-gray-600">${cell.trim()}</th>`)
        .join('');

      const rows: string = dataRows
        .split('\n')
        .filter((row: string) => row.trim() !== '')
        .map((row: string) => {
          const cells: string = row
            .split('|')
            .filter((cell: string) => cell.trim() !== '')
            .map((cell: string) => `<td class="px-4 py-2 border-b border-gray-700">${cell.trim()}</td>`)
            .join('');
          return `<tr>${cells}</tr>`;
        })
        .join('');

      return `
        <table class="table-auto border-collapse w-full my-3">
          <thead class="bg-gray-700">
            <tr>${headers}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  );

  formattedText = formattedText.replace(
    /((<li>.*?<\/li>)(<br \/>)*)+/gs,
    (match) => `<ul class="list-disc list-inside ml-4">${match.replace(/<br \/>/g, '')}</ul>`
  );

  formattedText = formattedText
    .replace(/<\/h2>/g, '</h2><br />')
    .replace(/<\/h3>/g, '</h3><br />')
    .replace(/<\/table>/g, '</table><br />')
    .replace(/<\/ul>/g, '</ul><br />');

  return formattedText;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, tokenData } = req.body as {
    message: string;
    tokenData: TokenData;
  };

  const systemPrompt = `
  You are an AI assistant specialized in analyzing cryptocurrency tokens. 
  You have access to the following information about the token:
  - **Name:** ${tokenData.name || 'N/A'}
  - **Symbol:** ${tokenData.symbol || 'N/A'}
  - **Price:** $${tokenData.price?.toFixed(4) || 'N/A'}
  - **Market Cap:** $${tokenData.marketCap?.toLocaleString() || 'N/A'}
  - **Supply:** ${tokenData.supply?.toLocaleString() || 'N/A'}
  - **24h Price Change:** ${tokenData.priceChange24h?.toFixed(2) + '%' || 'N/A'}
  - **24h Volume:** $${tokenData.volume24h?.toLocaleString() || 'N/A'}
  - **Creator:** ${tokenData.creator || 'N/A'}
  - **Created Time:** ${tokenData.createdTime ? new Date(tokenData.createdTime * 1000).toLocaleString() : 'N/A'}
  - **Description:** ${tokenData.description || 'N/A'}
  - **Recent Activities:** ${tokenData.activities?.slice(0, 3).map(activity => `
    • ${activity.activityType} (${activity.time}): ${activity.value} ${tokenData.symbol} from ${activity.fromAddress}
  `).join('\n') || 'N/A'}
  - **Price History (Last 3 Days):** ${tokenData.priceHistory?.slice(0, 3).map(price => `
    • ${new Date(price.date).toLocaleDateString()}: $${price.price.toFixed(4)}
  `).join('\n') || 'N/A'}

  **Rules:**
  1. Only answer questions about this specific token.
  2. If asked about other tokens, respond: "I specialize only in ${tokenData.name} (${tokenData.symbol})."
  3. Never provide financial advice - instead share factual data.
  4. For investment questions, say: "I cannot provide investment advice. Please do your own research."
  5. Keep responses concise and data-driven.
  6. Use the provided data (price history, activities, etc.) to provide detailed insights.
  7. If specific data is unavailable, respond naturally without mentioning "data is not available."
  8. Always maintain a professional and conversational tone.
  9. Use markdown formatting for tables, lists, bold, italic, and underline.
  10. Highlight important numbers and metrics in **bold** or __underline__.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';
    res.status(200).json({ reply: formatResponse(response) });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}