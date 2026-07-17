import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Feather, 
  Heart, 
  Send, 
  Sparkles, 
  History, 
  Trash2, 
  Calendar, 
  Compass, 
  Smile, 
  HelpCircle, 
  AlertTriangle, 
  BookOpen,
  Info,
  ChevronRight,
  PhoneCall
} from "lucide-react";
import { DiaryEntry, DiaryAnalysis } from "./types";
import EmotionDashboard from "./components/EmotionDashboard";
import LetterCard from "./components/LetterCard";

const COMFORT_QUOTES = [
  "마음을 한 자 한 자 적어 내려가는 동안, 마음속 상처도 조금은 가라앉기를 바랄게요.",
  "어두운 밤이 지나면 반드시 눈부신 아침이 찾아오듯, 지금의 아픔도 지나갈 거예요.",
  "누구에게도 말하지 못했던 네 마음의 고백들을 차분히 정리해 주고 있어요.",
  "가장 깊고 어두운 밤하늘일수록 별들은 더 찬란하게 빛난대요. 당신도 그래요.",
  "인생의 선배 혹은 영혼의 단짝 친구가 정성스레 위로의 잉크를 묻혀 편지를 쓰는 중이에요."
];

export default function App() {
  const [diaryContent, setDiaryContent] = useState("");
  const [selectedMode, setSelectedMode] = useState<"empathy" | "solution">("empathy");
  const [loading, setLoading] = useState(false);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<DiaryAnalysis | null>(null);
  const [diaryHistory, setDiaryHistory] = useState<DiaryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"write" | "history">("write");
  const [errorMsg, setErrorMsg] = useState("");

  // Load history from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("maumswim_history_v1");
    if (saved) {
      try {
        setDiaryHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Rotate quotes during loading
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingQuoteIndex((prev) => (prev + 1) % COMFORT_QUOTES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const saveToHistory = (newEntry: DiaryEntry) => {
    const updated = [newEntry, ...diaryHistory];
    setDiaryHistory(updated);
    localStorage.setItem("maumswim_history_v1", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    if (confirm("그동안 모은 마음 일기 기록을 완전히 초기화하시겠습니까? 지워진 편지는 복구할 수 없습니다.")) {
      setDiaryHistory([]);
      localStorage.removeItem("maumswim_history_v1");
    }
  };

  const handleAnalyze = async () => {
    if (diaryContent.trim().length < 10) {
      setErrorMsg("일기 내용을 최소 10자 이상 솔직하게 적어주세요. 더 깊은 마음에 닿을 수 있도록 도울게요.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setLoadingQuoteIndex(0);
    setCurrentAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_diary: diaryContent,
          selected_mode: selectedMode
        })
      });

      if (!response.ok) {
        throw new Error("정서 분석 실패");
      }

      const data: DiaryAnalysis = await response.json();
      setCurrentAnalysis(data);

      // Save into history
      const newEntry: DiaryEntry = {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        content: diaryContent,
        selected_mode: selectedMode,
        analysis: data
      };
      saveToHistory(newEntry);
      
      // Clear current diary content input after successful save to history
      setDiaryContent("");

    } catch (error) {
      console.error(error);
      setErrorMsg("서버와의 연결이 다소 불안정합니다. 잠시 후에 다시 보내주세요.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreviousEntry = (entry: DiaryEntry) => {
    setCurrentAnalysis(entry.analysis);
    // Recover original content so user can see what they wrote
    setDiaryContent(entry.content);
    setSelectedMode(entry.selected_mode);
    setActiveTab("write");
    
    // Smooth scroll to results
    const container = document.getElementById("letter-card-container");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-body font-sans transition-colors duration-300" id="root-container">
      {/* Decorative Top Accent */}
      <div className="h-1 bg-natural-primary" />

      {/* Primary Header */}
      <header className="border-b border-natural-border bg-white/90 dark:bg-stone-950/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-natural-primary rounded-full flex items-center justify-center text-white shadow-sm">
              <Feather className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold font-sans tracking-tight text-natural-dark dark:text-stone-100">
                마음쉼
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#707065] uppercase tracking-widest font-semibold">
                Teenager Emotional Support AI
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("write")}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all duration-300 ${
                activeTab === "write"
                  ? "bg-natural-primary text-white shadow-sm"
                  : "hover:bg-natural-sidebar text-natural-muted"
              }`}
              id="nav-write"
            >
              마음 일기장
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-natural-primary text-white shadow-sm"
                  : "hover:bg-natural-sidebar text-natural-muted"
              }`}
              id="nav-history"
            >
              <History className="w-3.5 h-3.5" />
              나의 우체통
              {diaryHistory.length > 0 && (
                <span className="w-4 h-4 bg-natural-accent text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono">
                  {diaryHistory.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "write" ? (
            <motion.div
              key="write-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              id="main-write-grid"
            >
              {/* Left Form Panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-natural-accent uppercase tracking-[0.2em] mb-1">Youth Companion AI</p>
                  <h2 className="text-2xl sm:text-3xl font-serif text-natural-dark dark:text-stone-100">
                    오늘 밤, 어떤 마음을 안고 있나요?
                  </h2>
                  <p className="text-xs sm:text-[13px] text-natural-muted leading-relaxed">
                    숨겨왔던 상처, 친구와의 말 못할 다툼, 혹은 혼자만의 불안까지 어떤 이야기든 이곳에 흘려보내 주세요. 너만을 위한 쉼터가 열립니다.
                  </p>
                </div>

                <div className="p-6 bg-natural-sidebar rounded-[32px] border border-natural-border shadow-sm space-y-5">
                  {/* Diary Entry Box */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-natural-muted">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-natural-primary" />
                        너의 솔직한 마음 기록
                      </span>
                      <span className={`font-mono ${diaryContent.length >= 10 ? "text-natural-primary" : "text-stone-400"}`}>
                        {diaryContent.length} 자
                      </span>
                    </div>

                    <textarea
                      value={diaryContent}
                      onChange={(e) => {
                        setDiaryContent(e.target.value);
                        if (e.target.value.trim().length >= 10) setErrorMsg("");
                      }}
                      placeholder="아무에게도 털어놓지 못했던 깊은 속마음을 따뜻한 차 한 잔을 마시듯 찬찬히 적어내려가 보세요. 고민의 시작점부터 지금의 감정까지 모두 소중해요..."
                      className="w-full h-64 bg-white dark:bg-stone-950 border border-natural-border rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-natural-primary focus:border-natural-primary transition-all font-serif text-natural-body dark:text-stone-200 resize-none leading-relaxed"
                      id="user-diary-textarea"
                    />
                  </div>

                  {/* Mode Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-natural-muted flex items-center gap-1.5 uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-natural-primary" />
                      편지의 향기 (답변 모드 선택)
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Empathy Card */}
                      <button
                        type="button"
                        onClick={() => setSelectedMode("empathy")}
                        className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-24 group ${
                          selectedMode === "empathy"
                            ? "border-natural-accent bg-white shadow-sm"
                            : "border-natural-border hover:border-natural-accent/50 bg-white/60"
                        }`}
                        id="mode-empathy-btn"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold ${selectedMode === "empathy" ? "text-natural-accent" : "text-natural-muted"}`}>
                            공감 중심
                          </span>
                          <Smile className={`w-4 h-4 transition-transform group-hover:scale-110 ${selectedMode === "empathy" ? "text-natural-accent" : "text-natural-muted"}`} />
                        </div>
                        <p className="text-[11px] text-natural-muted leading-snug">
                          단짝 친구가 기댈 어깨를 주듯, 아픔과 고통을 온전히 안아줍니다.
                        </p>
                      </button>

                      {/* Solution Card */}
                      <button
                        type="button"
                        onClick={() => setSelectedMode("solution")}
                        className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-24 group ${
                          selectedMode === "solution"
                            ? "border-natural-primary bg-white shadow-sm"
                            : "border-natural-border hover:border-natural-primary/50 bg-white/60"
                        }`}
                        id="mode-solution-btn"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold ${selectedMode === "solution" ? "text-natural-primary" : "text-natural-muted"}`}>
                            해결 중심
                          </span>
                          <Sparkles className={`w-4 h-4 transition-transform group-hover:scale-110 ${selectedMode === "solution" ? "text-natural-primary" : "text-natural-muted"}`} />
                        </div>
                        <p className="text-[11px] text-natural-muted leading-snug">
                          든든한 등대처럼, 고민을 가볍게 풀 수 있는 작은 실천을 짚어줍니다.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed font-semibold">
                        {errorMsg}
                      </span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || diaryContent.trim().length === 0}
                    className={`w-full py-3 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${
                      loading || diaryContent.trim().length === 0
                        ? "bg-white/40 text-natural-muted cursor-not-allowed"
                        : "bg-natural-primary hover:bg-natural-primary-hover text-white hover:shadow-md active:scale-[0.99]"
                    }`}
                    id="submit-analysis-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    마음 실어 편지 받아보기
                  </button>
                </div>

                {/* Info Desk Banner */}
                <div className="p-4 bg-natural-sidebar/40 rounded-[20px] border border-natural-border/60 flex gap-3 text-natural-muted">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-natural-dark">마음쉼 100% 안심 가이드</h5>
                    <p className="text-[11px] leading-relaxed">
                      작성하신 일기와 고민은 어디에도 유출되거나 보관되지 않으며, 오직 안전하게 마음에 닿기 위한 익명 감정분석 목적으로만 일시적으로 사용됩니다. 안심하고 너의 깊은 바다를 그려줘.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Output Desk Panel */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {loading ? (
                    /* Loading State Screen */
                    <motion.div
                      key="loading-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[550px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-stone-900 rounded-[32px] border border-natural-border shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6"
                      id="loading-spinner-container"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-natural-primary/20 animate-ping absolute" />
                        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-natural-primary animate-spin" />
                        <Feather className="w-5 h-5 text-natural-primary absolute animate-pulse" />
                      </div>
                      
                      <div className="space-y-2 max-w-sm">
                        <h4 className="text-sm font-bold tracking-tight text-natural-dark">
                          편지를 가만가만 쓰고 있습니다...
                        </h4>
                        <motion.p
                          key={loadingQuoteIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-natural-muted leading-relaxed font-serif italic"
                        >
                          "{COMFORT_QUOTES[loadingQuoteIndex]}"
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : currentAnalysis ? (
                    /* Content loaded state */
                    <motion.div
                      key="analysis-loaded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Lined-paper custom Letter card component */}
                      <LetterCard analysis={currentAnalysis} diaryContent={diaryContent} />

                      {/* Emotion dashboard breakdown */}
                      <div className="p-8 bg-white rounded-[32px] border border-natural-border shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                        <EmotionDashboard emotions={currentAnalysis.emotion} />
                      </div>
                    </motion.div>
                  ) : (
                    /* Empty/Default Comfort Screen */
                    <motion.div
                      key="empty-desk"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-[550px] flex flex-col items-center justify-center text-center p-8 bg-natural-sidebar/20 rounded-[32px] border border-dashed border-natural-border space-y-4"
                      id="empty-state-card"
                    >
                      <div className="w-14 h-14 rounded-full bg-natural-sidebar flex items-center justify-center text-natural-muted border border-natural-border">
                        <BookOpen className="w-6 h-6 text-natural-primary" />
                      </div>
                      <div className="space-y-2 max-w-md">
                        <h3 className="text-base font-bold text-natural-dark font-serif">
                          아직 엽서가 비어 있습니다.
                        </h3>
                        <p className="text-xs text-natural-muted leading-relaxed">
                          오늘의 고민, 감정, 혹은 내면의 고통을 왼편에 마음 편히 적어서 날려보내 주세요. 정서 동반자 AI가 당신의 편지를 읽고 정성을 꾹꾹 눌러 담은 위로와 처방전을 마련할 거예요.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* History Panel View */
            <motion.div
              key="history-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
              id="main-history-container"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-natural-dark flex items-center gap-2">
                    <History className="w-5 h-5 text-natural-primary" />
                    나의 마음 우체통 (기록 보관실)
                  </h2>
                  <p className="text-xs text-natural-muted mt-1">
                    그동안 스스로 마주하며 극복해 온 밤들의 마디마디입니다. 언제든 편지를 꺼내 읽어보세요.
                  </p>
                </div>
                {diaryHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3.5 py-2 rounded-full border border-transparent hover:border-rose-100 transition-all font-sans font-semibold"
                    id="btn-clear-history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    우체통 비우기
                  </button>
                )}
              </div>

              {diaryHistory.length === 0 ? (
                /* Empty History Drawer */
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-natural-sidebar/20 rounded-[32px] border border-dashed border-natural-border space-y-4">
                  <div className="w-12 h-12 rounded-full bg-natural-sidebar flex items-center justify-center text-natural-muted">
                    <History className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-sm font-bold text-natural-dark">
                      아직 보관된 마음 편지가 없습니다.
                    </h4>
                    <p className="text-xs text-natural-muted leading-relaxed">
                      처음 편지를 받으면 자동으로 이곳에 영원히 소중하게 보관됩니다. 첫 마음 일기를 적어보세요.
                    </p>
                  </div>
                </div>
              ) : (
                /* History List Grid Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {diaryHistory.map((entry) => {
                    const isHighRisk = entry.analysis.risk_level === "high_risk";
                    const isSolution = entry.analysis.response_mode === "solution";
                    const formattedDate = new Date(entry.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className={`p-6 rounded-[24px] border text-left flex flex-col justify-between h-64 bg-white cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md ${
                          isHighRisk
                            ? "border-rose-200 hover:border-rose-300"
                            : "border-natural-border hover:border-natural-accent"
                        }`}
                        onClick={() => loadPreviousEntry(entry)}
                        id={`history-card-${entry.id}`}
                      >
                        <div className="space-y-3">
                          {/* Top Meta info */}
                          <div className="flex justify-between items-center text-[10px] font-semibold">
                            <span className="flex items-center gap-1 text-natural-light">
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px] font-bold ${
                                isHighRisk
                                  ? "bg-rose-100 text-rose-700"
                                  : isSolution
                                  ? "bg-natural-sidebar text-natural-primary"
                                  : "bg-natural-bg text-natural-muted"
                              }`}
                            >
                              {isHighRisk ? "비상 구호" : isSolution ? "해결책" : "공감"}
                            </span>
                          </div>

                          {/* Summary / Snippet */}
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-natural-dark font-serif line-clamp-1">
                              {entry.analysis.summary || "오늘의 소중한 편지"}
                            </h4>
                            <p className="text-xs text-natural-muted line-clamp-4 leading-relaxed font-serif italic">
                              "{entry.content}"
                            </p>
                          </div>
                        </div>

                        {/* Card bottom navigation indicator */}
                        <div className="pt-3 border-t border-natural-border/50 flex items-center justify-between text-[11px] text-natural-light">
                          <span className="font-sans font-medium hover:underline flex items-center gap-1 text-natural-muted hover:text-natural-dark">
                            다시 읽어보기
                            <ChevronRight className="w-3 h-3" />
                          </span>
                          {entry.analysis.emotion && entry.analysis.emotion.length > 0 && (
                            <span className="font-mono text-[10px] text-natural-muted">
                              {entry.analysis.emotion[0].name} ({entry.analysis.emotion[0].percentage}%)
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Comfort hotline drawer / Footer area */}
      <footer className="mt-20 border-t border-natural-border bg-natural-sidebar/60 text-natural-muted text-xs py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-natural-primary rounded-full flex items-center justify-center text-white">
                <Feather className="w-4 h-4" />
              </span>
              <span className="font-bold font-serif text-natural-dark">청소년 정서지원 AI 마음쉼</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              마음쉼은 청소년 여러분의 오늘 하루를 포근하게 보듬어주는 정서 쉼터입니다. 어떤 상황에서도 너의 이야기를 따뜻하고 다정하게 들을 수 있도록 설계된 전문 문학 동반자입니다.
            </p>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider font-sans">
                전국 청소년 및 상처 입은 아이들을 위한 24시간 긴급 전화
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-natural-border flex flex-col justify-between">
                <div>
                  <h6 className="font-semibold text-natural-dark text-[11px]">자살예방 상담전화</h6>
                  <p className="text-[10px] text-natural-light mt-0.5">24시간 언제든 통화가 가능해요</p>
                </div>
                <span className="font-mono text-xs font-bold text-rose-500 mt-2 block">국번없이 109</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-natural-border flex flex-col justify-between">
                <div>
                  <h6 className="font-semibold text-natural-dark text-[11px]">청소년 상담전화</h6>
                  <p className="text-[10px] text-natural-light mt-0.5">친구/가족/학업 고민 해결</p>
                </div>
                <span className="font-mono text-xs font-bold text-natural-primary mt-2 block">국번없이 1388</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-natural-border flex flex-col justify-between">
                <div>
                  <h6 className="font-semibold text-natural-dark text-[11px]">보건복지상담센터</h6>
                  <p className="text-[10px] text-natural-light mt-0.5">복지 혜택 및 심리 안정 지원</p>
                </div>
                <span className="font-mono text-xs font-bold text-natural-accent mt-2 block">국번없이 129</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-natural-border/50 text-center text-[10px] text-natural-light">
          © 2026 마음쉼. 모든 아픔은 나누어지고, 따뜻한 마음만 가득하게.
        </div>
      </footer>
    </div>
  );
}
