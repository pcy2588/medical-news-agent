"use client";
import { NewsArticle, SOURCE_CONFIG } from "@/types";

interface Props {
  article: NewsArticle;
}

const CATEGORY_LABELS: Record<string, string> = {
  "infectious-disease": "감염병",
  cancer: "암",
  cardiology: "심장",
  "mental-health": "정신건강",
  research: "연구",
  "public-health": "공중보건",
  treatment: "치료",
  health: "건강",
  other: "기타",
};

export default function NewsCard({ article }: Props) {
  const src = SOURCE_CONFIG[article.source] ?? {
    label: article.source,
    color: "bg-slate-100 text-slate-700",
    icon: "📰",
  };
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${src.color}`}>
            {src.icon} {src.label}
          </span>
          {article.category && article.category !== "health" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {CATEGORY_LABELS[article.category] ?? article.category}
            </span>
          )}
        </div>
        {date && <time className="text-xs text-slate-400 shrink-0">{date}</time>}
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
          {article.title}
        </h2>
      </a>

      {article.summary && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{article.summary}</p>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {article.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
