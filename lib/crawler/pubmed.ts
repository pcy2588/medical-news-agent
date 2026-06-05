import Parser from "rss-parser";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

const PUBMED_RSS =
  "https://pubmed.ncbi.nlm.nih.gov/rss/search/0/?query=disease+treatment+outbreak&limit=20&utm_campaign=pubmed-2";

export async function crawlPubMed(): Promise<RawArticle[]> {
  const feed = await parser.parseURL(PUBMED_RSS);
  return feed.items.slice(0, 20).map((item) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    content: item.contentSnippet ?? item.content ?? "",
    source: "PubMed",
    source_url: "https://pubmed.ncbi.nlm.nih.gov",
    published_at: item.pubDate ?? item.isoDate,
  }));
}
