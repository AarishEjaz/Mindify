"use client";

import { Question } from "@/lib/types";

// Shows a single question with its options as selectable buttons.
// The parent owns the selected value and gets told when it changes.
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
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <p className="mb-4 font-medium text-zinc-800">
        {index + 1}. {question.questionText}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const isSelected = option.text === selectedOptionText;
          return (
            <button
              key={option.text}
              onClick={() => onSelect(question._id, option.text)}
              className={
                isSelected
                  ? "rounded-md border border-indigo-600 bg-indigo-50 px-4 py-2 text-left text-indigo-700"
                  : "rounded-md border border-zinc-200 bg-white px-4 py-2 text-left text-zinc-700 hover:border-indigo-300 hover:bg-zinc-50"
              }
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
