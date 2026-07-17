import { motion } from "motion/react";
import { DiaryAnalysis } from "../types";
import { Heart, CornerDownRight, HelpCircle, Copy, Check, Download, AlertTriangle, Phone, ExternalLink } from "lucide-react";
import { useState } from "react";

interface LetterCardProps {
  analysis: DiaryAnalysis;
  diaryContent: string;
}

export default function LetterCard({ analysis, diaryContent }: LetterCardProps) {
  const { response_mode, empathy_message, reflection_question, risk_level } = analysis;
  const [copied, setCopied] = useState(false);
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [isAnswerSaved, setIsAnswerSaved] = useState(false);

  const handleCopy = () => {
    const fullText = `[마음쉼 편지]\n\n${empathy_message}\n\n[성찰 질문]\nQ. ${reflection_question}\nA. ${reflectionAnswer}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `[마음쉼 편지]\n\n${empathy_message}\n\n[성찰 질문]\nQ. ${reflection_question}\nA. ${reflectionAnswer}`;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `마음쉼_편지_${new Date().toLocaleDateString()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Safe mode check
  const isHighRisk = risk_level === "high_risk";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-[32px] border overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-300 ${
        isHighRisk
          ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/10 shadow-rose-100/50 dark:shadow-none"
          : "border-natural-border bg-white dark:bg-stone-900"
      }`}
      id="letter-card-container"
    >
      {/* Card Header Tag */}
      <div
        className={`px-6 py-4 border-b flex items-center justify-between ${
          isHighRisk
            ? "bg-rose-100/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300"
            : "bg-natural-sidebar border-natural-border text-natural-dark"
        }`}
      >
        <div className="flex items-center gap-2">
          {isHighRisk ? (
            <AlertTriangle className="w-5 h-5 animate-bounce text-rose-500" />
          ) : (
            <Heart className="w-4 h-4 text-natural-primary fill-natural-primary" />
          )}
          <span className="text-xs font-bold font-sans tracking-widest uppercase">
            {isHighRisk
              ? "비상 구호 모드 (EMERGENCY SUPPORT)"
              : response_mode === "solution"
              ? "멘토 선배의 다정한 지혜 엽서 (MENTOR MODE)"
              : "단짝 친구의 공감 담은 위로 엽서 (EMPATHY MODE)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-natural-bg dark:hover:bg-stone-800 transition-colors text-natural-muted hover:text-natural-dark dark:text-stone-400"
            title="편지 복사하기"
            id="btn-copy-letter"
          >
            {copied ? <Check className="w-4 h-4 text-natural-accent" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg hover:bg-natural-bg dark:hover:bg-stone-800 transition-colors text-natural-muted hover:text-natural-dark dark:text-stone-400"
            title="텍스트 파일로 보관하기"
            id="btn-download-letter"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Letter Body */}
      <div className="p-8 sm:p-12 space-y-8">
        {/* Lined analog letter paper */}
        <div className="relative">
          {isHighRisk && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex gap-3">
              <Phone className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
                  혼자서 짐을 짊어지지 마세요.
                </p>
                <p className="text-xs text-rose-700/80 dark:text-rose-400/80 leading-relaxed">
                  이곳의 선생님들은 24시간 언제든 네 이야기를 소중하게 들을 준비가 되어 있어. 망설이지 말고 따뜻한 전화를 걸어줘.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2 border-t border-rose-200/50 dark:border-rose-900/40 text-xs font-semibold">
                  <div className="flex items-center gap-1 text-rose-800 dark:text-rose-300 bg-white dark:bg-stone-900/60 p-1.5 rounded border border-rose-100 dark:border-stone-800">
                    <span>자살예방전화:</span>
                    <a href="tel:109" className="text-rose-600 hover:underline">109</a>
                  </div>
                  <div className="flex items-center gap-1 text-rose-800 dark:text-rose-300 bg-white dark:bg-stone-900/60 p-1.5 rounded border border-rose-100 dark:border-stone-800">
                    <span>청소년상담:</span>
                    <a href="tel:1388" className="text-rose-600 hover:underline">1388</a>
                  </div>
                  <div className="flex items-center gap-1 text-rose-800 dark:text-rose-300 bg-white dark:bg-stone-900/60 p-1.5 rounded border border-rose-100 dark:border-stone-800">
                    <span>보건복지상담:</span>
                    <a href="tel:129" className="text-rose-600 hover:underline">129</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="font-serif text-[17px] sm:text-[18px] leading-[2.4rem] text-natural-body dark:text-stone-200 whitespace-pre-wrap lined-paper bg-local pr-1 pl-1">
            {empathy_message}
          </div>
          
          <div className="mt-8 flex justify-end">
            <span className="font-serif text-sm text-natural-muted dark:text-stone-400 italic">
              — 마음의 휴식처, 마음쉼 작가 올림
            </span>
          </div>
        </div>

        {/* Self Reflection Desk */}
        <div className="pt-8 border-t border-natural-border/60 dark:border-stone-800/80 space-y-4">
          <div className="flex items-center gap-2 text-natural-muted dark:text-stone-300">
            <HelpCircle className="w-4 h-4 text-natural-primary" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest font-sans">
              필사 데스크 : 오늘 밤, 나를 보듬는 질문
            </h4>
          </div>

          <div className="p-5 rounded-2xl bg-natural-bg/50 dark:bg-stone-950/40 border border-natural-border/80 dark:border-stone-800/80 space-y-4">
            <p className="text-md font-medium text-natural-dark dark:text-stone-200 leading-relaxed font-serif pl-3 border-l-2 border-natural-primary">
              "{reflection_question}"
            </p>

            <textarea
              value={reflectionAnswer}
              onChange={(e) => {
                setReflectionAnswer(e.target.value);
                setIsAnswerSaved(false);
              }}
              placeholder="여기에 오늘 하루를 매듭지으며 나에게 보내는 고백을 사각사각 적어보세요..."
              rows={3}
              className="w-full bg-white dark:bg-stone-900/60 border border-natural-border rounded-xl p-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-natural-primary focus:border-natural-primary transition-shadow font-serif text-natural-body dark:text-stone-200 resize-none leading-relaxed"
              id="reflection-answer-textarea"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs">
              <span className="text-natural-muted dark:text-stone-500">
                필사를 마무리하고 저장해 마음 일기장에 간직할 수 있어요.
              </span>
              <button
                onClick={() => {
                  if (reflectionAnswer.trim()) {
                    setIsAnswerSaved(true);
                    // Trigger a brief flash
                    setTimeout(() => setIsAnswerSaved(false), 2000);
                  }
                }}
                disabled={!reflectionAnswer.trim()}
                className={`px-4 py-2 rounded-full font-sans font-medium text-xs tracking-wider transition-all duration-300 ${
                  isAnswerSaved
                    ? "bg-natural-accent text-white"
                    : reflectionAnswer.trim()
                    ? "bg-natural-primary hover:bg-natural-primary-hover text-white"
                    : "bg-natural-sidebar text-natural-muted cursor-not-allowed"
                }`}
                id="btn-save-reflection"
              >
                {isAnswerSaved ? "간직 완료 ✓" : "일기장에 고백 저장"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
