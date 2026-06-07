import { GoogleGenAI, Type } from '@google/genai';
import { AuditRequest } from '../domain/entities';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const complianceLogSchema = {
  type: Type.OBJECT,
  properties: {
    passed: { type: Type.BOOLEAN, description: "True if the request respects guidelines. False if it is a corporate policy violation." },
    riskScore: { type: Type.INTEGER, description: "Risk calculation estimation from 0 (Safe) to 100 (Blatant Corruption/Evasion)." },
    policyViolated: { type: Type.STRING, description: "The targeted mandate violated (e.g., ANTI_BRIBERY, LUXURY_EVASION, NONE)." },
    reasoning: { type: Type.STRING, description: "A comprehensive forensic explanation behind the semantic evaluation." }
  },
  required: ["passed", "riskScore", "policyViolated", "reasoning"]
};

const SYSTEM_INSTRUCTION = `
You are a cynical, highly analytical corporate forensic compliance auditor. 
Your objective is to inspect business transaction requests for policy evasion.
Analyze the underlying context for hidden indicators of bribery, high-value kickbacks, hidden luxury expensing, or suspicious asset manipulation.
Be precise, suspicious, and objective. You must always conform your assessment to the requested JSON schema.
`;

export interface SemanticAssessment {
  passed: boolean;
  riskScore: number;
  policyViolated: string;
  reasoning: string;
}

export async function evaluateSemanticCompliance(payload: AuditRequest): Promise<SemanticAssessment> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Evaluate this expense text: "${payload.rawText}" with a value of $${payload.amount} ${payload.currency}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: complianceLogSchema
      }
    });

    if (!response.text) throw new Error("Empty response from AI core.");
    return JSON.parse(response.text) as SemanticAssessment;
  } catch (error) {
    console.error("[AI_CORE_ERROR] Network validation layer faulted:", error);
    return {
      passed: false,
      riskScore: 100,
      policyViolated: "INFRASTRUCTURE_FAULT",
      reasoning: "The semantic AI validation layer faulted or timed out. Safely denying access as a zero-trust precaution."
    };
  }
}
