import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = (page - 1) * limit;

  let builder = supabase
    .from("news_articles")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (source && source !== "all") builder = builder.eq("source", source);
  if (category && category !== "all") builder = builder.eq("category", category);
  if (query) builder = builder.ilike("title", `%${query}%`);

  const { data, error, count } = await builder;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ articles: data, total: count, page, limit });
}
