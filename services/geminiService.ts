import { GoogleGenAI } from "@google/genai";
import { ValuationData } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeStock = async (ticker: string): Promise<ValuationData> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a senior financial analyst following Aswath Damodaran's valuation methodology.
      
      Step 1: USE GOOGLE SEARCH to find the EXACT CURRENT REAL-TIME PRICE of the US stock ticker: "${ticker}".
      Step 2: Perform a comprehensive valuation analysis based on that current price.
      Step 3: Generate a Fair Value, Bear Value, and Best Value based on Discounted Cash Flow (DCF).

      You must estimate:
      1. Risk-Free Rate
      2. Equity Risk Premium (ERP)
      3. Beta
      4. Cost of Equity & WACC
      5. Terminal Growth Rate

      Output ONLY a valid JSON object with the following structure (do not use Markdown code blocks if possible, or I will parse them out):
      {
        "ticker": "string",
        "companyName": "string",
        "currentPriceEstimate": number, // MUST be the real-time price found from search
        "currency": "string",
        "fairValue": number,
        "bearValue": number,
        "bestValue": number,
        "summary": "string (A concise executive summary in Thai language)",
        "valuationDate": "YYYY-MM-DD",
        "metrics": [
          { "label": "string", "value": "string", "description": "string (in Thai)" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json", // Removed to allow tool use flexibility
        temperature: 0.2, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from AI");
    }

    // Extract JSON from potential Markdown blocks (```json ... ```)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Raw response:", text);
      throw new Error("Invalid response format from AI");
    }

    const data = JSON.parse(jsonMatch[0]) as ValuationData;

    // Extract grounding sources (URLs)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceUrls = chunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => uri);
    
    // Remove duplicates
    data.sourceUrls = [...new Set(sourceUrls)];

    return data;

  } catch (error) {
    console.error("Valuation Error:", error);
    throw new Error("ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้ กรุณาตรวจสอบชื่อหุ้นหรือลองใหม่อีกครั้ง");
  }
};