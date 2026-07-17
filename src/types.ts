export interface EmotionScore {
  name: string;
  percentage: number;
}

export interface DiaryAnalysis {
  response_mode: "solution" | "empathy";
  emotion: EmotionScore[];
  summary: string;
  empathy_message: string;
  reflection_question: string;
  risk_level: "normal" | "warning" | "high_risk";
}

export interface DiaryEntry {
  id: string;
  createdAt: string; // ISO string
  content: string;
  selected_mode: "solution" | "empathy";
  analysis: DiaryAnalysis;
}
