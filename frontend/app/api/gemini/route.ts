import { google } from "@ai-sdk/google"
import { NextRequest } from "next/server";
import { streamText } from 'ai';


export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    const result = streamText({
        model: google("gemini-2.5-flash-preview-04-17"),
        system: 'You are a helpful assistant.',
        messages: messages,
    });
    return result.toTextStreamResponse();
}