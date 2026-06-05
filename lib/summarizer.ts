import { RawArticle } from "@/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface SummaryResult {
  summary: string;
  tags: string[];
  category: string;
}

export async function summarizeArticle(article: RawArticle): Promise<SummaryResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { summary: article.content?.slice(0, 300) ?? "", tags: [], category: "health" };
  }

  const prompt = `You are a medical news analyst. Summarize the following health/medical news article in Korean (한국어).

Title: ${article.title}
Source: ${article.source}
Content: ${article.content?.slice(0, 2000) ?? "No content available"}

Respond in JSON format:
{
  "summary": "2-3 sentence Korean summary of the key medical/health information",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "one of: infectious-disease, cancer, cardiology, mental-health, research, public-health, treatment, other"
}`;

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://medical-news-agent.vercel.app",
      "X-Title": "Medical News Agent",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("OpenRouter error:", err);
    return { summary: article.content?.slice(0, 300) ?? "", tags: [], category: "health" };
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary ?? "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      category: parsed.category ?? "health",
    };
  } catch {
    return { summary: content.slice(0, 300), tags: [], category: "health" };
  }
}
