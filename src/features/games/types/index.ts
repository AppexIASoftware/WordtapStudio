export interface GameModeItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  level: number;
  unlockStars: number;
  timeLimit: number;
  points: number;
  status: "active" | "fase2" | "fase3";
  phase: "active" | "fase2" | "fase3";
}
