// app/api/chat/route.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function iteratorToStream(iterator: any) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()
            if (done) {
                controller.close()
            } else {
                controller.enqueue(value.text)
            }
        }
    })
};

export async function POST(req: Request) {
    const { message, context, id, entityType } = await req.json();
    const systemInstruction = `You are a helpful assistant for researching Requests for Proposals (RFP). Recommend the most relevant RFPs from the rfps provided given
    the industry of the client
        `
    const fullMessage = `user message: ${message} rfps: ${JSON.stringify(context)} industry: ${entityType} `

    try {
        // Initialize the chat
        const chat = ai.chats.create({
            model: "gemini-2.0-flash-lite",
            history: [
                { role: "user", parts: [{ text: "Hello" }] },
                { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
            ],
            config: {
                systemInstruction
            }
        });

        // Send the first message stream
        const iterator = await chat.sendMessageStream({ message: fullMessage });

        const stream = iteratorToStream(iterator)

        // Respond with the full response
        return new Response(stream)
    } catch (error: any) {
        return Response.json({ error: 'Failed to get response from Gemini API', details: error.message }, { status: 500 });
    }
}
