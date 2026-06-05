"use client";

interface CrawlLog {
  id: string;
  source: string;
  status: string;
  articles_found: number;
  articles_new: number;
  started_at: string;
  error_message?: string;
}

interface Props {
  total: number;
  recentLogs: CrawlLog[];
  bySource: Record<string, number>;
}

export default function StatsPanel({ total, recentLogs, bySource }: Props) {
  const lastCrawl = recentLogs[0];
  const lastCrawlTime = lastCrawl
    ? new Date(lastCrawl.started_at).toLocaleString("ko-KR")
    : "없음";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm text-slate-500 mb-1">전체 기사</p>
        <p className="text-3xl font-bold text-slate-900">{total.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm text-slate-500 mb-1">수집 소스</p>
        <p className="text-3xl font-bold text-slate-900">{Object.keys(bySource).length}</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm text-slate-500 mb-1">마지막 수집</p>
        <p className="text-sm font-semibold text-slate-700">{lastCrawlTime}</p>
        {lastCrawl && (
          <p className={`text-xs mt-1 ${lastCrawl.status === "success" ? "text-green-600" : "text-red-500"}`}>
            {lastCrawl.status === "success" ? `✓ ${lastCrawl.articles_new}건 신규` : `✗ ${lastCrawl.error_message?.slice(0, 40)}`}
          </p>
        )}
      </div>
    </div>
  );
}
