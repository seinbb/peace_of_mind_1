import { motion } from "motion/react";
import { EmotionScore } from "../types";
import { Sparkles, Brain, Flame, Skull, CloudRain, Heart } from "lucide-react";

interface EmotionDashboardProps {
  emotions: EmotionScore[];
}

const EMOTION_CONFIGS: Record<string, { color: string; icon: any; bg: string; text: string }> = {
  "불안": { color: "bg-[#8E9B82]", icon: Brain, bg: "bg-[#8E9B82]/10 dark:bg-[#8E9B82]/15", text: "text-[#5A6344] dark:text-[#A2AD97]" },
  "슬픔": { color: "bg-[#7B8A6B]", icon: CloudRain, bg: "bg-[#7B8A6B]/10 dark:bg-[#7B8A6B]/15", text: "text-[#4A5334] dark:text-[#B7C0AF]" },
  "스트레스": { color: "bg-[#B7C0AF]", icon: Skull, bg: "bg-[#B7C0AF]/10 dark:bg-[#B7C0AF]/15", text: "text-[#707065] dark:text-[#C7D0BF]" },
  "분노": { color: "bg-[#5A6344]", icon: Flame, bg: "bg-[#5A6344]/10 dark:bg-[#5A6344]/15", text: "text-[#2D2D2B] dark:text-[#D9D9D0]" },
  "무기력": { color: "bg-[#A2AD97]", icon: Sparkles, bg: "bg-[#A2AD97]/10 dark:bg-[#A2AD97]/15", text: "text-[#707065] dark:text-[#A2AD97]" },
  "기쁨": { color: "bg-[#8DA37E]", icon: Heart, bg: "bg-[#8DA37E]/10 dark:bg-[#8DA37E]/15", text: "text-[#5A6344] dark:text-[#8DA37E]" }
};

export default function EmotionDashboard({ emotions }: EmotionDashboardProps) {
  // Sort emotions by percentage descending so primary emotions are prominent
  const sortedEmotions = [...emotions].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-4" id="emotion-dashboard">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-natural-sidebar text-natural-primary">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </span>
        <h3 className="text-sm font-bold text-natural-dark dark:text-stone-300 font-sans tracking-wide uppercase">
          오늘 밤 내 마음의 여섯 빛깔
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedEmotions.map((emo, index) => {
          const config = EMOTION_CONFIGS[emo.name] || {
            color: "bg-natural-primary",
            icon: Sparkles,
            bg: "bg-natural-sidebar/40",
            text: "text-natural-primary"
          };
          const IconComponent = config.icon;

          return (
            <motion.div
              key={emo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-xl border border-natural-border/60 dark:border-stone-800/80 ${config.bg} flex flex-col justify-between`}
              id={`emotion-card-${emo.name}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 ${config.text}`} />
                  <span className="text-xs font-semibold text-natural-dark dark:text-stone-300 font-sans">
                    {emo.name}
                  </span>
                </div>
                <span className={`text-xs font-bold font-mono ${config.text}`}>
                  {emo.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-natural-border/40 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emo.percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 + 0.2 }}
                  className={`h-full rounded-full ${config.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
