import Parser from "rss-parser";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

export async function crawlWHO(): Promise<RawArticle[]> {
  const feed = await parser.parseURL("https://www.who.int/rss-feeds/news-english.xml");
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    content: item.contentSnippet ?? item.content ?? "",
    source: "WHO",
    source_url: "https://www.who.int",
    published_at: item.pubDate ?? item.isoDate,
  }));
}
