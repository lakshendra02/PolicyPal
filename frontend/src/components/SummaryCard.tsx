type SummaryCardProps = {
  summary: string;
};

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-2xl max-w-3xl mx-auto p-8 mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Policy Summary</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
    </div>
  );
}
