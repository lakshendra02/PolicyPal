import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

interface Policy {
  _id: string;
  filename: string;
  summary: string;
  context: string;
  createdAt: string;
}

export default function PoliciesList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await api.get("/api/policies");
        setPolicies(res.data);
      } catch (err) {
        console.error("Error fetching policies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading policies...</p>;
  }

  if (policies.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">No policies uploaded yet.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Upload Policy
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <h1 className="text-2xl font-bold mb-6">Your Policies</h1>
      <div className="space-y-4">
        {policies.map((policy) => (
          <div
            key={policy._id}
            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md cursor-pointer"
            onClick={() =>
              navigate(`/policy/${policy._id}`, {
                state: {
                  summary: policy.summary,
                  context: policy.context,
                },
              })
            }
          >
            <h2 className="text-lg font-semibold">{policy.filename}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {policy.summary.slice(0, 100)}...
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Uploaded on {new Date(policy.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
