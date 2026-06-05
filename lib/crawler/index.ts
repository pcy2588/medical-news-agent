import { crawlWHO } from "./who";
import { crawlCDC } from "./cdc";
import { crawlNIH } from "./nih";
import { crawlPubMed } from "./pubmed";
import { crawlMedicalXpress } from "./medicalxpress";
import { crawlGoogleNews } from "./google-news";
import { crawlReuters } from "./reuters";
import { summarizeArticle } from "@/lib/summarizer";
import { supabaseAdmin } from "@/lib/supabase";
import { RawArticle, CrawlResult } from "@/types";

const CRAWLERS: Array<{ name: string; fn: () => Promise<RawArticle[]> }> = [
  { name: "WHO", fn: crawlWHO },
  { name: "CDC", fn: crawlCDC },
  { name: "NIH", fn: crawlNIH },
  { name: "PubMed", fn: crawlPubMed },
  { name: "MedicalXpress", fn: crawlMedicalXpress },
  { name: "Google News", fn: crawlGoogleNews },
  { name: "Reuters", fn: crawlReuters },
];

async function runCrawler(name: string, fn: () => Promise<RawArticle[]>): Promise<CrawlResult> {
  const startedAt = new Date().toISOString();

  // Insert crawl log
  const { data: logRow } = await supabaseAdmin
    .from("crawl_logs")
    .insert({ source: name, status: "running", started_at: startedAt })
    .select()
    .single();

  try {
    const articles = await fn();
    let articlesNew = 0;

    for (const article of articles) {
      if (!article.url || !article.title) continue;

      // Check if already exists
      const { data: existing } = await supabaseAdmin
        .from("news_articles")
        .select("id")
        .eq("url", article.url)
        .maybeSingle();

      if (existing) continue;

      // Summarize with LLM
      const { summary, tags, category } = await summarizeArticle(article);

      await supabaseAdmin.from("news_articles").insert({
        title: article.title,
        summary,
        original_content: article.content,
        url: article.url,
        source: article.source,
        source_url: article.source_url,
        category,
        tags,
        published_at: article.published_at ?? null,
      });

      articlesNew++;
    }

    if (logRow) {
      await supabaseAdmin
        .from("crawl_logs")
        .update({
          status: "success",
          articles_found: articles.length,
          articles_new: articlesNew,
          completed_at: new Date().toISOString(),
        })
        .eq("id", logRow.id);
    }

    return { source: name, articles };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${name}] crawl error:`, msg);

    if (logRow) {
      await supabaseAdmin
        .from("crawl_logs")
        .update({
          status: "error",
          error_message: msg,
          completed_at: new Date().toISOString(),
        })
        .eq("id", logRow.id);
    }

    return { source: name, articles: [], error: msg };
  }
}

export async function runAllCrawlers(): Promise<CrawlResult[]> {
  const results = await Promise.allSettled(
    CRAWLERS.map(({ name, fn }) => runCrawler(name, fn))
  );

  return results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { source: CRAWLERS[i].name, articles: [], error: String(r.reason) }
  );
}
