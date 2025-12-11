import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

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

export async function GET() {
  return NextResponse.json({ status: "webhook listening" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  const { event, error } = await constructWebhookEvent(req, secret);

  if (error || !event) {
    console.error("Webhook validation error:", error);
    return NextResponse.json({ error: error || "Invalid event" }, { status: 401 });
  }

  if (event.type === "post_call_transcription") {
    // Extract all user messages from the transcript
    const userMessages = event.data.transcript
      .filter((item) => item.role === "user")
      .map((item) => item.message);

    console.log("User messages from call:", userMessages);
    console.log("Full transcript:", JSON.stringify(event.data.transcript, null, 2));

    // TODO: Process user messages (e.g., save to database, trigger actions, etc.)
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

const constructWebhookEvent = async (
  req: NextRequest,
  secret?: string
): Promise<{ event: WebhookEvent | null; error: string | null }> => {
  const body = await req.text();
  const signature_header = req.headers.get("ElevenLabs-Signature");

  if (!signature_header) {
    return { event: null, error: "Missing signature header" };
  }

  const headers = signature_header.split(",");
  const timestamp = headers.find((e) => e.startsWith("t="))?.substring(2);
  const signature = headers.find((e) => e.startsWith("v0="));

  if (!timestamp || !signature) {
    return { event: null, error: "Invalid signature format" };
  }

  // Validate timestamp (within 30 minutes)
  const reqTimestamp = Number(timestamp) * 1000;
  const tolerance = Date.now() - 30 * 60 * 1000;
  if (reqTimestamp < tolerance) {
    return { event: null, error: "Request expired" };
  }

  // Validate HMAC signature
  const message = `${timestamp}.${body}`;

  if (!secret) {
    return { event: null, error: "Webhook secret not configured" };
  }

  const digest =
    "v0=" + crypto.createHmac("sha256", secret).update(message).digest("hex");

  if (signature !== digest) {
    return { event: null, error: "Invalid signature" };
  }

  const event = JSON.parse(body) as WebhookEvent;
  return { event, error: null };
};
