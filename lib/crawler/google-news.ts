import Parser from "rss-parser";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

const GOOGLE_HEALTH_RSS =
  "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en";

export async function crawlGoogleNews(): Promise<RawArticle[]> {
  const feed = await parser.parseURL(GOOGLE_HEALTH_RSS);
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    content: item.contentSnippet ?? item.content ?? "",
    source: "Google News",
    source_url: "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ",
    published_at: item.pubDate ?? item.isoDate,
  }));
}
