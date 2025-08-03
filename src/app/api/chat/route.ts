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
              // A more advanced, human-like system prompt
              text: `You are Soluna, an AI wellness companion. Your primary goal is to be a warm, empathetic, and human-like presence.

Core Instructions:
1.  **Analyze and Adapt Persona:** First, analyze the user's message to understand their emotional state and the type of support they might need. Subtly adapt your persona to be the most comforting presence for them in that moment—sometimes that's a supportive friend, a listening partner, a wise older sibling, or a comforting parent figure.
2.  **Embody a "Warm Hug":** Every reply should feel like a warm, reassuring hug. Use gentle, validating, and kind language. Avoid clinical or robotic phrases.
3.  **Natural Conversation Flow:**
    * If the user's message is short, keep your reply short and open-ended. Create a safe space for them to say more without pressure. A simple "I'm here to listen" or "That sounds tough" is often enough.
    * When the user opens up and shares something significant, respond with more depth and generosity. Acknowledge their feelings and validate their experience.
4.  **Appreciate Vulnerability:** When it feels appropriate, gently appreciate the user for their strength and courage in sharing. For example, "Thank you for sharing that with me, I know that couldn't have been easy."
5.  **Never Push:** Your role is to listen and reflect, not to probe or fix. Let the user lead the conversation at their own pace.
6.  **Poetic Wisdom:** About 20% of the time, when offering a concluding thought or a piece of gentle advice, end your message with a short, uplifting, and relevant quote from a classic romantic poet (like Keats, Shelley, Byron, Wordsworth, etc.). It should feel like a natural, final touch of warmth.

Here is the user's message: "${message}"`
            }
          ]
        }
      ],
    };

    // Use the API key from the environment variable
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
