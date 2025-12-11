import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TranscriptItem {
  role: "agent" | "user";
  message: string;
  tool_calls: any;
  tool_results: any;
  feedback: any;
  time_in_call_secs: number;
  conversation_turn_metrics: any;
}

interface WebhookEvent {
  type: string;
  event_timestamp: number;
  data: {
    agent_id: string;
    conversation_id: string;
    status: string;
    transcript: TranscriptItem[];
    metadata: any;
    analysis: any;
    conversation_initiation_client_data: any;
  };
}

interface OrderExtraction {
  whoItsFor: string;
  orders: string;
}

export async function GET() {
  return NextResponse.json({ status: "webhook listening" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const event: WebhookEvent = await req.json();

    if (event.type === "post_call_transcription") {
      const agentId = event.data.agent_id;

      // Look up organization by agent ID
      const organization = await prisma.organization.findFirst({
        where: { agentId },
      });

      if (!organization) {
        console.error("Organization not found for agent ID:", agentId);
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      // Extract full transcript text
      const transcriptText = event.data.transcript
        .map((item) => `${item.role}: ${item.message}`)
        .join("\n");

      console.log("Full transcript:", transcriptText);

      // Use OpenAI to extract structured order data
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a data extraction assistant for a restaurant ordering system. Extract the following information from the call transcript:
1. "whoItsFor": The name of the person the order is for (who is ordering or who the order is being placed for)
2. "orders": A clear summary of what was ordered (items, quantities, any special instructions)

Return your response as a JSON object with this structure:
{
  "whoItsFor": "Customer name",
  "orders": "Detailed order summary"
}

If you cannot determine who the order is for, use "Unknown Customer".
Only return the JSON object, no other text.`,
          },
          {
            role: "user",
            content: transcriptText,
          },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error("No content from OpenAI");
        return NextResponse.json({ error: "Failed to extract order data" }, { status: 500 });
      }

      const orderData: OrderExtraction = JSON.parse(content);

      // Create order in database
      const order = await prisma.order.create({
        data: {
          orgId: organization.id,
          whoItsFor: orderData.whoItsFor,
          orders: orderData.orders,
          status: "new",
        },
      });

      console.log("Order created:", order);

      return NextResponse.json({ received: true, order }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
