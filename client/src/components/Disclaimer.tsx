// The non-diagnostic disclaimer. Shown on the instructions page and the
// result page. Defined as a component so the wording stays consistent.
export default function Disclaimer({ text }: { text?: string }) {
  const message =
    text ||
    "This assessment is for guidance and self-reflection only. It is not a medical or clinical diagnosis.";

  return (
    <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <strong className="font-semibold">Please note: </strong>
      {message}
    </div>
  );
}
