"use server"

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

export async function generateTTS(text: string) {
    try {
        const response = await elevenlabs.textToSpeech.convert("Nhs7eitvQWFTQBsf0yiT", {
            text,
            modelId: "eleven_multilingual_v2",
            outputFormat: "mp3_44100_128",
        });

        const chunks: Uint8Array[] = [];

        if ((response as any).getReader) {
            const reader = (response as any).getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
        } else {
            for await (const chunk of response as any) {
                chunks.push(chunk);
            }
        }

        const buffer = Buffer.concat(chunks);
        return buffer.toString("base64");
    } catch (error: any) {
        console.error("TTS Error:", error);
        throw new Error(`TTS Failed: ${error.message}`);
    }
}
