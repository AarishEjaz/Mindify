"use client";

import { Question } from "@/lib/types";

// Colours for a circle, based on which side of the scale it is on and
// how far it is from the neutral centre (ends are the strongest).
function circleColors(side: "agree" | "neutral" | "disagree", distance: number) {
  if (side === "neutral") {
    return { border: "border-zinc-300", hover: "hover:bg-zinc-100", fill: "bg-zinc-400" };
  }
  if (side === "agree") {
    return distance >= 2
      ? { border: "border-emerald-600", hover: "hover:bg-emerald-50", fill: "bg-emerald-600" }
      : { border: "border-emerald-400", hover: "hover:bg-emerald-50", fill: "bg-emerald-500" };
  }
  // disagree
  return distance >= 2
    ? { border: "border-purple-600", hover: "hover:bg-purple-50", fill: "bg-purple-600" }
    : { border: "border-purple-400", hover: "hover:bg-purple-50", fill: "bg-purple-500" };
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Shows a single question with its options as a horizontal "agree to
// disagree" circle scale (like 16personalities). The biggest circles are
// at the ends; each circle has its option label printed beneath it.
export default function QuestionCard({
  question,
  index,
  selectedOptionText,
  onSelect,
}: {
  question: Question;
  index: number;
  selectedOptionText: string | undefined;
  onSelect: (questionId: string, optionText: string) => void;
}) {
  // Show the highest score (Strongly Agree) on the LEFT, so the green
  // "Agree" side is on the left like the reference design. This is purely
  // visual — we still submit the option text, never a position.
  const options = [...question.options].sort((a, b) => b.score - a.score);

  const lastIndex = options.length - 1;
  const center = lastIndex / 2;

  return (
    <div className="rounded-[3px] border border-zinc-200 bg-white p-5 sm:p-6">
      <p className="mb-6 flex gap-2 font-medium text-zinc-900">
        <span className="font-bold tabular-nums text-indigo-600">
          {String(index + 1).padStart(2, "0")}
        </span>
        {question.questionText}
      </p>

      <div className="flex items-start justify-center gap-1.5 sm:gap-3">
        {/* "Agree" end label (green) */}
        <div className="hidden h-14 items-center sm:flex">
          <span className="text-sm font-semibold text-emerald-600">Agree</span>
        </div>

        {options.map((option, i) => {
          const distance = Math.abs(i - center);
          const side =
            i < center ? "agree" : i > center ? "disagree" : "neutral";
          const colors = circleColors(side, distance);
          const isSelected = option.text === selectedOptionText;

          // Bigger circles at the ends, smallest in the middle.
          const size = 32 + Math.round(distance) * 9; // e.g. 50,41,32,41,50

          return (
            <div key={option.text} className="flex w-14 flex-col items-center gap-2 sm:w-20">
              {/* Fixed-height slot so every label lines up at the same level */}
              <div className="flex h-14 items-center justify-center">
                <button
                  type="button"
                  onClick={() => onSelect(question._id, option.text)}
                  aria-label={option.text}
                  aria-pressed={isSelected}
                  title={option.text}
                  style={{ width: size, height: size }}
                  className={`flex cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
                    colors.border
                  } ${isSelected ? colors.fill : `bg-white ${colors.hover}`}`}
                >
                  {isSelected && <CheckIcon />}
                </button>
              </div>

              <span
                className={`text-center text-[11px] leading-tight ${
                  isSelected ? "font-semibold text-zinc-900" : "text-zinc-500"
                }`}
              >
                {option.text}
              </span>
            </div>
          );
        })}

        {/* "Disagree" end label (purple) */}
        <div className="hidden h-14 items-center sm:flex">
          <span className="text-sm font-semibold text-purple-600">Disagree</span>
        </div>
      </div>
    </div>
  );
}
