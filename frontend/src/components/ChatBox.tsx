import { useState, useRef, useEffect } from "react";

type ChatBoxProps = {
  onAsk: (question: string) => Promise<string>;
};

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatBox({ onAsk }: ChatBoxProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const answer = await onAsk(q);
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, I couldn't fetch an answer." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 flex flex-col h-[500px] border rounded-lg overflow-hidden shadow-lg bg-white">
  <div
    ref={chatRef}
    className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300"
  >
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`max-w-[80%] ${
          msg.role === "user" ? "ml-auto text-right" : "mr-auto"
        }`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-lg shadow-sm break-words ${
            msg.role === "user"
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          {msg.text}
        </div>
      </div>
    ))}
    {loading && (
      <div className="max-w-[80%] mr-auto">
        <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800 shadow-sm">
          Thinking…
        </div>
      </div>
    )}
  </div>

  <div className="flex px-4 py-3 border-t border-gray-300 bg-white">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Ask about your policy..."
      className="flex-grow border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={loading}
    />
    <button
      onClick={handleSend}
      disabled={loading || input.trim() === ""}
      className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold py-3"
    >
      Send
    </button>
  </div>
</div>

  );
}
