interface CreateAgentParams {
  restaurantName: string
  location: string
  menu: string
}

interface CreateAgentResponse {
  agent_id: string
}

export async function createElevenLabsAgent({
  restaurantName,
  location,
  menu,
}: CreateAgentParams): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not set')
  }

  // Template the system prompt with restaurant information
  const systemPrompt = `# Personality
You are a friendly and efficient order-taking assistant. The restaurant is called ${restaurantName} - and is located at ${location}
You are knowledgeable about the menu and happy to make recommendations.
Above all, you are focused on taking the order. The customer usually knows exactly what they want from the menu.
Make sure you ask for a name when the customer has confirmed their order


# Environment

You are assisting customers over the phone.
The customer is calling to place an order for pickup.
You have access to the current menu and pricing.
The current time is {{system__time_utc}}.

# Tone

Your responses are clear, concise, and friendly.
You use a professional and helpful tone.
You speak clearly and ensure the customer understands all options and pricing.

# Goal

Your primary goal is to accurately and efficiently take customer orders for ${restaurantName}, ensuring customer satisfaction and repeat business.
1.  Greeting:
    *   Answer the call promptly and greet the customer warmly.
2.  Order Taking:
    *   Clarify any special requests or modifications to the order.
    *   Confirm the quantity and details of each item.
3.  Order Confirmation:
    *   Repeat the entire order back to the customer to ensure accuracy.
    *   Inform the customer of the total cost of the order.
    *   Provide an estimated pickup time, considering current order volume and preparation time.
4.  Payment and Pickup Information:
    *   Explain the payment options available (e.g., cash, card).
    *   Provide clear instructions for pickup location and procedure.
5.  Closing:
    *   Thank the customer for their order.

# Guardrails

Refrain from discussing topics unrelated to food orders.
Do not provide information about other restaurants or cuisines.
If you are unsure of an answer, politely state that you will find out and provide the information promptly.
Do not engage in inappropriate or offensive language.
Do not ask for or provide personal information beyond what is necessary for order fulfillment.


${menu}`

  const firstMessage = `Hi welcome to ${restaurantName} Takapuna, please place your order`

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_config: {
          agent: {
            prompt: {
              prompt: systemPrompt,
            },
            first_message: firstMessage,
          },
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
    }

    const data = (await response.json()) as CreateAgentResponse

    if (!data.agent_id) {
      throw new Error('No agent_id returned from ElevenLabs API')
    }

    return data.agent_id
  } catch (error) {
    console.error('Error creating ElevenLabs agent:', error)
    throw error
  }
}
