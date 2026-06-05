import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical News Agent",
  description: "최신 의료·질병 정보 자동 수집 및 AI 요약 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Medical News Agent</h1>
              <p className="text-xs text-slate-500">WHO · CDC · NIH · PubMed · MedicalXpress · Google News · Reuters</p>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-sm text-slate-400">
          AI 요약은 OpenRouter Auto 모델이 생성합니다. 의료적 판단은 전문가와 상담하세요.
        </footer>
      </body>
    </html>
  );
}
