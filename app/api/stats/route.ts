import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  const [articlesRes, logsRes, sourcesRes] = await Promise.all([
    supabase.from("news_articles").select("*", { count: "exact", head: true }),
    supabase
      .from("crawl_logs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(7),
    supabase
      .from("news_articles")
      .select("source")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        data?.forEach((r) => { counts[r.source] = (counts[r.source] ?? 0) + 1; });
        return counts;
      }),
  ]);

  return NextResponse.json({
    total: articlesRes.count ?? 0,
    recentLogs: logsRes.data ?? [],
    bySource: sourcesRes,
  });
}
