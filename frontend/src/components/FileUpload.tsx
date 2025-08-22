import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file || loading) return;
  setLoading(true);

  try {
      // Upload + parse & save to DB
      const formData = new FormData();
      formData.append("file", file);
      const parseRes = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const policy = parseRes.data;

      // Summarize using LLM
      const sumRes = await api.post("/api/llm/summarize", { text: policy.context });
      const summary: string = sumRes.data.summary || "No summary produced.";

      // Get the auth token from localStorage or your auth provider
      const token = localStorage.getItem("authToken"); // adjust key as per your storage

      // Update summary in backend with Authorization header!
      await api.put(
        `/api/policies/${policy._id}`,
        { summary },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Navigate to detailed view using policy id
      navigate(`/policy/${policy._id}`, { state: { summary, context: policy.context } });
    } catch (err) {
      console.error(err);
      alert("Failed to process the file. Please login and try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-lg w-full mx-auto p-6 border-2 border-dashed border-gray-300 rounded-xl text-center shadow-sm bg-white">
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-l-md hover:bg-blue-700 transition-colors inline-block"
      >
        Choose PDF
      </label>
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="ml-2 mt-0 bg-green-600 text-white px-6 py-2 rounded-r-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-block"
      >
        {loading ? "Processing..." : "Upload & Summarize"}
      </button>
      {file && <p className="mt-4 text-gray-600 truncate">{file.name}</p>}
    </div>
  );

}