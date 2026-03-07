import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

export const getBudgetInsights = async (expenses: Expense[]) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please check your GitHub Secrets.");
    }
    
    // 1. Initialize the AI client
    const ai = new GoogleGenAI({ apiKey });
    
    const expenseSummary = expenses.map(e => ({
      name: e.name,
      category: e.category,
      amount: e.amount,
      quantity: e.quantity,
      timestamp: e.timestamp
    }));

    // 2. Use the updated model name and correct method call
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Updated to the current stable model
      contents: `Here are my recent expenses: ${JSON.stringify(expenseSummary)}. Can you provide 3 brief, actionable financial tips or insights?`,
      config: {
        systemInstruction: "You are a friendly and professional financial advisor named BudgetBee. Your goal is to help users save money and manage their budgets better. Keep your advice concise, encouraging, and based on the data provided.",
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Error getting budget insights:", error);
    return `I couldn't generate insights right now. Please try again later!`;
  }
};