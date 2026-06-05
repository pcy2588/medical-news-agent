import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import { RawArticle } from "@/types";

const parser = new Parser({ timeout: 10000 });

export async function crawlReuters(): Promise<RawArticle[]> {
  // Try Reuters Health RSS; fall back to scraping if needed
  try {
    const feed = await parser.parseURL("https://feeds.reuters.com/reuters/healthNews");
    return feed.items.slice(0, 20).map((item) => ({
      title: item.title ?? "",
      url: item.link ?? "",
      content: item.contentSnippet ?? item.content ?? "",
      source: "Reuters",
      source_url: "https://www.reuters.com/business/healthcare-pharmaceuticals",
      published_at: item.pubDate ?? item.isoDate,
    }));
  } catch {
    // RSS may be unavailable — scrape the health section
    const { data } = await axios.get(
      "https://www.reuters.com/business/healthcare-pharmaceuticals/",
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; MedicalNewsBot/1.0)" }, timeout: 10000 }
    );
    const $ = cheerio.load(data);
    const articles: RawArticle[] = [];
    $("a[data-testid='Heading']").each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href");
      if (title && href) {
        articles.push({
          title,
          url: href.startsWith("http") ? href : `https://www.reuters.com${href}`,
          content: "",
          source: "Reuters",
          source_url: "https://www.reuters.com/business/healthcare-pharmaceuticals",
        });
      }
    });
    return articles.slice(0, 20);
  }
}
