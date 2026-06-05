import Parser from "rss-parser";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

export async function crawlCDC(): Promise<RawArticle[]> {
  const feed = await parser.parseURL("https://www.cdc.gov/rss/all.rss.xml");
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    content: item.contentSnippet ?? item.content ?? "",
    source: "CDC",
    source_url: "https://www.cdc.gov",
    published_at: item.pubDate ?? item.isoDate,
  }));
}
