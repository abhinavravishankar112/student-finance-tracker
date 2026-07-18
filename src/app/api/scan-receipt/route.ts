import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const PROMPT = 'Analyze this receipt image. Extract the total amount paid, the merchant/store name (as description), and classify the purchase into ONE category from this exact list: ["Rent", "Groceries", "Dining Out", "Transport", "Entertainment", "Books"]. Respond ONLY with a valid JSON object in this exact format, no markdown, no extra text: { "amount": <number>, "category": "<string>", "description": "<string>" }'

async function callGemini(ai: GoogleGenAI, model: string, mimeType: string, base64Data: string) {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          { text: PROMPT },
          { inlineData: { mimeType, data: base64Data } },
        ],
      },
    ],
  })
  return response
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured. Add GEMINI_API_KEY to .env.local.' },
      { status: 500 }
    )
  }

  try {
    const { image } = await req.json()

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // image is a base64 data URL: "data:image/jpeg;base64,..."
    const matches = image.match(/^data:(.+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }
    const mimeType = matches[1]
    const base64Data = matches[2]

    const ai = new GoogleGenAI({ apiKey })

    // Try models in order — each has its own independent quota pool
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.0-flash']
    let lastError: any = null

    for (const model of modelsToTry) {
      try {
        const response = await callGemini(ai, model, mimeType, base64Data)
        const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

        // Strip any markdown fences if the model returns them
        const jsonText = rawText.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim()

        let parsedData
        try {
          parsedData = JSON.parse(jsonText)
        } catch {
          console.error(`[${model}] Failed to parse response as JSON:`, rawText)
          return NextResponse.json(
            { error: 'Could not parse receipt data from the image. Try a clearer photo.' },
            { status: 422 }
          )
        }

        // Validate the shape
        if (typeof parsedData.amount !== 'number' || !parsedData.category || !parsedData.description) {
          return NextResponse.json(
            { error: 'Unexpected response format. Try a clearer photo.' },
            { status: 422 }
          )
        }

        return NextResponse.json(parsedData)
      } catch (err: any) {
        const status = err?.status ?? err?.code
        // If it's a quota/rate-limit error, try the next model
        if (status === 429 || err?.message?.includes('RESOURCE_EXHAUSTED') || err?.message?.includes('quota')) {
          console.warn(`[${model}] Quota exceeded, trying next model...`)
          lastError = err
          continue
        }
        // Any other error — surface it immediately
        throw err
      }
    }

    // All models exhausted
    console.error('All Gemini models hit quota limits:', lastError)
    return NextResponse.json(
      { error: 'AI quota exceeded. Please enable billing on your Google AI Studio project or try again later.' },
      { status: 429 }
    )
  } catch (error: any) {
    console.error('Error scanning receipt:', error)
    const message = error?.message ?? 'Failed to scan receipt'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}