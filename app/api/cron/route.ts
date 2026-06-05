import { NextResponse } from "next/server";
import { runAllCrawlers } from "@/lib/crawler";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await runAllCrawlers();
  const summary = results.map((r) => ({
    source: r.source,
    found: r.articles.length,
    error: r.error ?? null,
  }));

  return NextResponse.json({ ok: true, results: summary });
}
