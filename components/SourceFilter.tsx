"use client";
import { SOURCE_CONFIG } from "@/types";

const SOURCES = ["all", ...Object.keys(SOURCE_CONFIG)];

interface Props {
  selected: string;
  onChange: (source: string) => void;
  counts?: Record<string, number>;
}

export default function SourceFilter({ selected, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {SOURCES.map((src) => {
        const cfg = SOURCE_CONFIG[src];
        const count = src === "all" ? Object.values(counts ?? {}).reduce((a, b) => a + b, 0) : (counts?.[src] ?? 0);
        const isActive = selected === src;

        return (
          <button
            key={src}
            onClick={() => onChange(src)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {cfg ? `${cfg.icon} ${cfg.label}` : "전체"}
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
