import { useLocation, useNavigate, useParams } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import ChatBox from "../components/ChatBox";
import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

type LocationState = { summary?: string; context?: string };

export default function PolicyView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const state = (location.state || {}) as LocationState;
  const [summary, setSummary] = useState<string | undefined>(state.summary);
  const [context, setContext] = useState<string | undefined>(state.context);
  const [loading, setLoading] = useState(!state.summary || !state.context);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!id || (summary && context)) return; // already have data

      try {
        const res = await api.get(`/api/policies/${id}`);
        setSummary(res.data.summary);
        setContext(res.data.context);
      } catch (err) {
        console.error("Error fetching policy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id, summary, context]);

  const askFn = useMemo(
    () => async (question: string): Promise<string> => {
      if (!context) return "No policy context available.";
      const res = await api.post("/api/llm/ask", { text: context, question });
      return res.data?.answer ?? "No answer returned.";
    },
    [context]
  );

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading policy...</p>;
  }

  if (!summary || !context) {
    return (
      <div className="px-4 mt-10 flex flex-col items-center">
        <div className="bg-white shadow-md p-6 rounded-xl max-w-xl">
          <p className="text-gray-700">
            No policy found. Please go back to your policies list.
          </p>
          <button
            onClick={() => navigate("/policies")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-10 flex flex-col items-center">
      <SummaryCard summary={summary} />
      <ChatBox onAsk={askFn} />
    </div>
  );
}
