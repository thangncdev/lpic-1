interface Props {
  explanation: string | null | undefined;
}

export default function QuestionExplanation({ explanation }: Props) {
  if (!explanation?.trim()) return null;

  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
        Explanation
      </div>
      <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
        {explanation}
      </p>
    </div>
  );
}
