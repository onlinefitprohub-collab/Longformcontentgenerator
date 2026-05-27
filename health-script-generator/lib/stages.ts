import { Stage } from "@/types";

export const STAGES: Omit<Stage, "complete">[] = [
  { id: 0, label: "Stage 0", title: "Context & Platform",      accent: "#10B981" },
  { id: 1, label: "Stage 1", title: "Practitioner Background", accent: "#3B82F6" },
  { id: 2, label: "Stage 2", title: "Transformation Stories",  accent: "#8B5CF6" },
  { id: 3, label: "Stage 3", title: "Knowledge Pillars",       accent: "#EF4444" },
  { id: 4, label: "Stage 4", title: "Audience & Questions",    accent: "#F59E0B" },
  { id: 5, label: "Stage 5", title: "Contrarian Views",        accent: "#EC4899" },
  { id: 6, label: "Stage 6", title: "Protocols & Frameworks",  accent: "#06B6D4" },
  { id: 7, label: "Stage 7", title: "Script Mapping",          accent: "#84CC16" },
];
