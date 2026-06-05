import { NextResponse } from "next/server";
import { runAllCrawlers } from "@/lib/crawler";

export const maxDuration = 300;

export async function POST(req: Request) {
  const secret = req.headers.get("x-crawl-secret");
  if (secret && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await runAllCrawlers();
    const summary = results.map((r) => ({
      source: r.source,
      found: r.articles.length,
      error: r.error ?? null,
    }));

    return NextResponse.json({ ok: true, results: summary });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
