import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 detik, akan naik eksponensial
const RETRYABLE_STATUSES = [429, 503]; // rate-limit & overload

async function callGroqWithRetry(
  apiKey: string,
  body: object,
): Promise<{ data: Record<string, unknown>; status: number }> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    // Jika berhasil atau error bukan retryable, langsung return
    if (response.ok || !RETRYABLE_STATUSES.includes(response.status)) {
      return { data, status: response.status };
    }

    // 429/503 → tunggu lalu retry (exponential backoff)
    if (attempt < MAX_RETRIES - 1) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
      console.warn(
        `Groq ${response.status} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    } else {
      // Semua retry gagal
      return { data, status: response.status };
    }
  }

  // Fallback (seharusnya tidak tercapai)
  return {
    data: { error: { message: "Max retries exceeded" } },
    status: 503,
  };
}

export async function POST(req: Request) {
  try {
    // Cek autentikasi — hanya user yang login yang bisa pakai chatbot
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk menggunakan FitBot." },
        { status: 401 },
      );
    }

    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set in environment variables" },
        { status: 500 },
      );
    }

    // Format messages untuk Groq (OpenAI-compatible format)
    const formattedMessages = [
      {
        role: "system",
        content:
          "Kamu adalah FitBot, asisten kesehatan super cerdas. Kamu ahli nutrisi, diet, dan olahraga. Selalu gunakan sapaan ramah dan gunakan markdown untuk format jawaban. Gunakan bahasa Indonesia. Jangan terlalu kaku, gunakan bahasa yang asik namun informatif.",
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const requestBody = {
      model: GROQ_MODEL,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2048,
    };

    const { data, status } = await callGroqWithRetry(apiKey, requestBody);

    if (status !== 200) {
      const errorMsg =
        (data.error as { message?: string })?.message ||
        "Gagal mendapatkan respons dari Groq";
      return NextResponse.json({ error: errorMsg }, { status });
    }

    const choices = data.choices as
      | { message?: { content?: string } }[]
      | undefined;
    const botResponse =
      choices?.[0]?.message?.content ||
      "Maaf, saya tidak dapat menjawab saat ini.";

    return NextResponse.json({ response: botResponse });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
