import { GoogleGenAI, Modality, Type } from "@google/genai";
import { A11Y_SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from "../constants";
import { AnalysisResult } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeContent = async (
    mimeType: string,
    data: string, // Base64 or text content
    isText: boolean = false
): Promise<AnalysisResult> => {
    const ai = getClient();

    let parts: any[] = [];

    if (isText) {
        parts.push({ text: data });
    } else {
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: data,
            },
        });
    }

    parts.push({ text: "Analyze this content for AODA and WCAG 2.1 AA compliance. Return the result in JSON." });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
            systemInstruction: A11Y_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }

    try {
        return JSON.parse(text) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON", text);
        throw new Error("Failed to parse analysis result");
    }
};

// Audio helper functions
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
    const ai = getClient();
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio generated");
    }

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBytes = decode(base64Audio);
    return await decodeAudioData(audioBytes, outputAudioContext, 24000, 1);
};
