import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ValuationData } from "../types";

// Initialize the API client
// Note: In a real production app, ensure API_KEY is handled securely on the server-side via Next.js API routes or similar.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const valuationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ticker: { type: Type.STRING, description: "The stock ticker symbol (e.g., AAPL)" },
    companyName: { type: Type.STRING, description: "Full company name" },
    currentPriceEstimate: { type: Type.NUMBER, description: "Estimated current market price based on knowledge" },
    currency: { type: Type.STRING, description: "Currency code (e.g., USD)" },
    fairValue: { type: Type.NUMBER, description: "The calculated Fair Value based on base case assumptions" },
    bearValue: { type: Type.NUMBER, description: "The calculated Bear Case Value (pessimistic)" },
    bestValue: { type: Type.NUMBER, description: "The calculated Best Case Value (optimistic)" },
    summary: { type: Type.STRING, description: "A concise executive summary of the valuation reasoning in Thai language." },
    valuationDate: { type: Type.STRING, description: "Date of analysis (YYYY-MM-DD)" },
    metrics: {
      type: Type.ARRAY,
      description: "Key financial metrics used in the Damodaran valuation model",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Name of the metric (e.g., Cost of Capital, Beta)" },
          value: { type: Type.STRING, description: "The value of the metric formatted as string (e.g., '8.5%')" },
          description: { type: Type.STRING, description: "Short explanation of this metric in Thai" }
        },
        required: ["label", "value", "description"]
      }
    }
  },
  required: [
    "ticker", 
    "companyName", 
    "currentPriceEstimate", 
    "fairValue", 
    "bearValue", 
    "bestValue", 
    "summary", 
    "metrics",
    "currency",
    "valuationDate"
  ]
};

export const analyzeStock = async (ticker: string): Promise<ValuationData> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a senior financial analyst following Aswath Damodaran's valuation methodology.
      Perform a comprehensive valuation analysis for the US stock ticker: "${ticker}".

      Generate a Fair Value, Bear Value, and Best Value based on Discounted Cash Flow (DCF) or relevant intrinsic value models.
      
      You must estimate:
      1. Risk-Free Rate
      2. Equity Risk Premium (ERP)
      3. Beta (Bottom-up if possible, or regression)
      4. Cost of Equity & Cost of Capital (WACC)
      5. Terminal Growth Rate
      6. Return on Invested Capital (ROIC)

      Provide the result in Thai language for descriptions and summary, but keep technical financial terms in English where appropriate (e.g., WACC, Beta).
      
      The 'currentPriceEstimate' should be your best estimate of the recent trading price.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: valuationSchema,
        temperature: 0.2, // Low temperature for more analytical/consistent results
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from AI");
    }

    const data = JSON.parse(text) as ValuationData;
    return data;

  } catch (error) {
    console.error("Valuation Error:", error);
    throw new Error("ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้ กรุณาตรวจสอบชื่อหุ้นหรือลองใหม่อีกครั้ง");
  }
};