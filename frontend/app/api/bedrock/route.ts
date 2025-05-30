import { bedrock } from "@ai-sdk/amazon-bedrock"
import { NextRequest, NextResponse } from "next/server";
import { streamText } from 'ai';
import { NextApiResponse } from "next";


const model = bedrock('anthropic.claude-3-5-haiku-20241022-v1:0', {

});

export async function POST(req: NextRequest, res: NextApiResponse) {
    const { messages } = await req.json();
    const result = streamText({
        model: model,
        system: 'You are a helpful assistant.',
        messages: messages,
    });

    console.log(result)

    return result.pipeDataStreamToResponse(res);
}