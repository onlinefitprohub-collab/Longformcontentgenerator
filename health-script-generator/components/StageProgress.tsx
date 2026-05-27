"use client";

import { STAGES } from "@/lib/stages";

interface StageProgressProps {
  currentStageIdx: number;
}

export default function StageProgress({ currentStageIdx }: StageProgressProps) {
  const progress = Math.min((currentStageIdx / 7) * 100, 100);
  const activeStage = STAGES[Math.min(currentStageIdx, STAGES.length - 1)];

  return (
    <div className="w-full px-4 py-3 bg-white border-b border-gray-100">
      {/* Stage pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STAGES.map((stage) => {
          const isComplete = stage.id < currentStageIdx;
          const isActive = stage.id === currentStageIdx;
          const isPending = stage.id > currentStageIdx;

          return (
            <div
              key={stage.id}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                isPending ? "bg-gray-100 text-gray-400" : "text-white"
              }`}
              style={
                isComplete
                  ? { backgroundColor: "#10B981" }
                  : isActive
                  ? { backgroundColor: stage.accent }
                  : {}
              }
            >
              {isComplete && (
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: activeStage.accent,
          }}
        />
      </div>
    </div>
  );
}
