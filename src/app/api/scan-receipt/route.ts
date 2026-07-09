import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    // Ask OpenAI Vision to parse the receipt
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, cheap, and highly capable for receipts
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this receipt. Extract the total amount, the merchant name (as description), and guess the category from this exact list: ["Rent", "Groceries", "Dining Out", "Transport", "Entertainment", "Books", "Income"]. Respond ONLY with valid JSON in this format: { "amount": number, "category": string, "description": string }' },
            {
              type: 'image_url',
              image_url: { url: image },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' }, // Forces strict JSON output
    })

    const jsonString = response.choices[0].message.content
    const parsedData = JSON.parse(jsonString || '{}')

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Error scanning receipt:', error)
    return NextResponse.json({ error: 'Failed to scan receipt' }, { status: 500 })
  }
}