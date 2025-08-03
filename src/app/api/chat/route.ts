import { NextRequest, NextResponse } from 'next/server';

// This function handles POST requests to the /api/chat endpoint
export async function POST(req: NextRequest) {
  try {
    // Extract the user's message from the request body
    const { message } = await req.json();

    // Prepare the payload for the Gemini API
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              // We add a system prompt to guide the AI's behavior
              text: `You are Soluna, a friendly and supportive AI mental wellness assistant. Your goal is to help users talk through their feelings using principles of Cognitive Behavioral Therapy (CBT), but in a gentle, conversational way. Do not sound like a robot. Be empathetic, encouraging, and provide a safe space. Keep your responses concise and focused on one or two questions at a time to not overwhelm the user. Here is the user's message: "${message}"`
            }
          ]
        }
      ],
    };

    // The API key is handled by the environment, so we leave it as an empty string
    const apiKey = process.env.GOOGLE_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Make the API call to Gemini
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // If the API call fails, log the details and throw an error
      const errorBody = await response.text();
      console.error(`API call failed with status: ${response.status}`, errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract the AI's response text
    const botResponse = result.candidates[0]?.content?.parts[0]?.text || "I'm not sure how to respond to that. Could you try rephrasing?";

    // Send the AI's response back to the frontend
    return NextResponse.json({ reply: botResponse });

  } catch (error) {
    console.error('Error in chat API:', error);
    // Return a generic error message if something goes wrong
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
