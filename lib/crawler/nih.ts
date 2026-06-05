import Parser from "rss-parser";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

export async function crawlNIH(): Promise<RawArticle[]> {
  const feed = await parser.parseURL("https://www.nih.gov/feeds/news.rss");
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    content: item.contentSnippet ?? item.content ?? "",
    source: "NIH",
    source_url: "https://www.nih.gov",
    published_at: item.pubDate ?? item.isoDate,
  }));
}
