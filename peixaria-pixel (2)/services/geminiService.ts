import { GoogleGenAI } from "@google/genai";
import { CaughtFish } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFishermanDialogue = async (
  context: 'WELCOME' | 'SALE' | 'RARE_CATCH' | 'NO_CATCH', 
  fishName?: string,
  price?: number
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    let prompt = "";

    switch (context) {
      case 'WELCOME':
        prompt = "Você é um velho pescador rabugento mas sábio dono de uma peixaria pixel art. Dê uma saudação curta e engraçada (máximo 15 palavras) para o jogador que acabou de chegar na loja.";
        break;
      case 'SALE':
        prompt = `O jogador acabou de vender um ${fishName} por ${price} moedas. Faça um comentário curto e sarcástico ou impressionado sobre o lucro (máximo 15 palavras).`;
        break;
      case 'RARE_CATCH':
        prompt = `O jogador pescou um peixe muito raro: ${fishName}! Expresse choque e admiração como um velho marinheiro (máximo 15 palavras).`;
        break;
      case 'NO_CATCH':
        prompt = "O peixe escapou. Dê um conselho curto e meio inútil de pescador (máximo 10 palavras).";
        break;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallbacks if API fails
    if (context === 'WELCOME') return "Bem-vindo à cabana!";
    if (context === 'SALE') return "Bom negócio, garoto.";
    if (context === 'RARE_CATCH') return "Pelos barbas do profeta!";
    return "O peixe foi mais esperto.";
  }
};

export const generateCustomerGossip = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Crie uma fofoca curta (1 frase) que um cliente de uma peixaria em uma vila de pixel art diria. Algo sobre o mar, o clima ou peixes.",
        });
        return response.text || "O mar está agitado hoje.";
    } catch (e) {
        return "Ouvi dizer que os peixes grandes estão no fundo.";
    }
}
