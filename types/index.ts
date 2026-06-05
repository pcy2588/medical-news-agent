export interface NewsArticle {
  id: string;
  title: string;
  summary: string | null;
  original_content: string | null;
  url: string;
  source: string;
  source_url: string | null;
  category: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrawlLog {
  id: string;
  source: string;
  status: "success" | "error";
  articles_found: number;
  articles_new: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface RawArticle {
  title: string;
  url: string;
  content?: string;
  source: string;
  source_url: string;
  published_at?: string;
}

export interface CrawlResult {
  source: string;
  articles: RawArticle[];
  error?: string;
}

export const SOURCE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  WHO: { label: "WHO", color: "bg-blue-100 text-blue-800", icon: "🌐" },
  CDC: { label: "CDC", color: "bg-red-100 text-red-800", icon: "🏥" },
  NIH: { label: "NIH", color: "bg-green-100 text-green-800", icon: "🔬" },
  PubMed: { label: "PubMed", color: "bg-purple-100 text-purple-800", icon: "📄" },
  MedicalXpress: { label: "MedicalXpress", color: "bg-orange-100 text-orange-800", icon: "📰" },
  "Google News": { label: "Google News", color: "bg-yellow-100 text-yellow-800", icon: "📡" },
  Reuters: { label: "Reuters", color: "bg-gray-100 text-gray-800", icon: "🗞️" },
};
