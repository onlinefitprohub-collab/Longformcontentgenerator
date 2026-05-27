"use client";

import { STAGES } from "@/lib/stages";

interface StageProgressProps {
  currentStageIdx: number;
}

export default function StageProgress({ currentStageIdx }: StageProgressProps) {
  const capped = Math.min(currentStageIdx, STAGES.length - 1);
  const activeStage = STAGES[capped];

  return (
    <div className="bg-white border-t border-gray-100 px-4 pt-3 pb-2.5">
      <div className="max-w-3xl mx-auto">

        {/* Step track */}
        <div className="flex items-center">
          {STAGES.map((stage, idx) => {
            const complete = idx < capped;
            const active = idx === capped;
            return (
              <div
                key={stage.id}
                className={`flex items-center ${idx < STAGES.length - 1 ? "flex-1" : ""}`}
              >
                {/* Circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                    style={
                      complete
                        ? { backgroundColor: "#10B981", color: "#fff" }
                        : active
                        ? {
                            backgroundColor: stage.accent,
                            color: "#fff",
                            boxShadow: `0 0 0 3px ${stage.accent}30`,
                          }
                        : { backgroundColor: "#F3F4F6", color: "#9CA3AF" }
                    }
                  >
                    {complete ? (
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      idx
                    )}
                  </div>
                </div>

                {/* Connector line */}
                {idx < STAGES.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1.5 transition-all duration-500"
                    style={{ backgroundColor: idx < capped ? "#10B981" : "#E5E7EB" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Active stage label */}
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-[11px] font-semibold"
            style={{ color: activeStage.accent }}
          >
            {activeStage.label}
          </span>
          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-500 font-medium">
            {activeStage.title}
          </span>
          {capped === 7 && (
            <>
              <span className="text-[11px] text-gray-300">·</span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Script generation
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
