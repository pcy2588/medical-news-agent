import Parser from "rss-parser";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

export async function crawlMedicalXpress(): Promise<RawArticle[]> {
  const feed = await parser.parseURL("https://medicalxpress.com/rss-feed/");
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    content: item.contentSnippet ?? item.content ?? "",
    source: "MedicalXpress",
    source_url: "https://medicalxpress.com",
    published_at: item.pubDate ?? item.isoDate,
  }));
}
