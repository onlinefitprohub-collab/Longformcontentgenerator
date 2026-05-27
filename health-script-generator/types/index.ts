export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
  stageId: number;
  timestamp: number;
  isError?: boolean;
}

export interface Stage {
  id: number;
  label: string;
  title: string;
  accent: string;
  complete: boolean;
}

export interface VideoTitle {
  number: number;
  title: string;
  theme: string;
  description: string;
}

export interface VideoScript {
  number: number;
  title: string;
  teleprompterScript: string;
  editingDirections: string;
  retentionNotes: string;
  publishingNotes: string;
}

export interface SessionData {
  practitionerName?: string;
  platform?: string;
  startedAt: number;
  messages: Message[];
  currentStageIdx: number;
  videoTitles?: VideoTitle[];
  scripts?: VideoScript[];
}
