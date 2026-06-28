// The non-diagnostic disclaimer. Shown on the instructions page and the
// result page. Defined as a component so the wording stays consistent.
export default function Disclaimer({ text }: { text?: string }) {
  const message =
    text ||
    "This assessment is for guidance and self-reflection only. It is not a medical or clinical diagnosis.";

  return (
    <div className="rounded-[2px] border border-amber-200 border-l-2 border-l-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <strong className="font-semibold">Please note: </strong>
      {message}
    </div>
  );
}
