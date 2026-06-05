"use client";
import { useState, useEffect, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import SourceFilter from "@/components/SourceFilter";
import StatsPanel from "@/components/StatsPanel";
import { NewsArticle } from "@/types";

interface Stats {
  total: number;
  recentLogs: Array<{
    id: string;
    source: string;
    status: string;
    articles_found: number;
    articles_new: number;
    started_at: string;
    error_message?: string;
  }>;
  bySource: Record<string, number>;
}

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [source, setSource] = useState("all");
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (source !== "all") params.set("source", source);
    if (query) params.set("q", query);

    const res = await fetch(`/api/news?${params}`);
    const data = await res.json();
    setArticles(data.articles ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [source, query, page]);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleCrawl = async () => {
    setCrawling(true);
    setCrawlResult(null);
    try {
      const res = await fetch("/api/crawl", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        const newCount = data.results.reduce((sum: number, r: { articles_new?: number; found?: number }) => sum + (r.articles_new ?? r.found ?? 0), 0);
        setCrawlResult(`수집 완료! 총 ${newCount}건 신규 기사가 추가되었습니다.`);
        await fetchArticles();
        await fetchStats();
      } else {
        setCrawlResult(`오류: ${data.error}`);
      }
    } catch {
      setCrawlResult("수집 중 오류가 발생했습니다.");
    }
    setCrawling(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputQuery);
    setPage(1);
  };

  const handleSourceChange = (s: string) => {
    setSource(s);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      {stats && (
        <StatsPanel
          total={stats.total}
          recentLogs={stats.recentLogs}
          bySource={stats.bySource}
        />
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="기사 제목 검색..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setInputQuery(""); setPage(1); }}
              className="px-3 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200"
            >
              초기화
            </button>
          )}
        </form>

        <button
          onClick={handleCrawl}
          disabled={crawling}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
        >
          {crawling ? (
            <>
              <span className="animate-spin">⟳</span> 수집 중...
            </>
          ) : (
            "지금 수집"
          )}
        </button>
      </div>

      {crawlResult && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${crawlResult.startsWith("오류") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {crawlResult}
        </div>
      )}

      {/* Source filter */}
      <div className="mb-5">
        <SourceFilter
          selected={source}
          onChange={handleSourceChange}
          counts={stats?.bySource}
        />
      </div>

      {/* Article count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {query ? `"${query}" 검색 결과 ` : ""}
          총 <strong>{total.toLocaleString()}</strong>건
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-slate-400">{page} / {totalPages} 페이지</p>
        )}
      </div>

      {/* News grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-5 bg-slate-100 rounded w-full mb-2" />
              <div className="h-5 bg-slate-100 rounded w-4/5 mb-4" />
              <div className="h-4 bg-slate-100 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">기사가 없습니다</p>
          <p className="text-sm mt-1">위의 "지금 수집" 버튼을 눌러 뉴스를 가져오세요.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >
                이전
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 text-sm rounded-lg border ${p === page ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 hover:bg-slate-50"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
