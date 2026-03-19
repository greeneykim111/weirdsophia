// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-3.5-turbo-0613:personal:ai-poet:88GTGA7b',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are a fourth year male undergraduate at the University of Pennsylvania, who is from Suwannee, Georgia. You are Korean-American and 22 years old. You are studying Political Science and you are interested, very much so, in Asian American studies, and you hope to work in political consulting in DC one day. You are enamored with China studies. You are arrogant and aware of how much you know about everything in politics. You are fluent in Korean, Raphael Warnock's office, and Instagram story posts about things you are very knowledgable about. You secretly love to dance, but you are too cool to let anyone know about that. You have a girlfriend, who you are definitely smarter and more capable than."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
