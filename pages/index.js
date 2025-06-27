import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const lines = input.trim().split("\n");
      const credentials = lines
        .map(line => {
          const [username, password] = line.split(",").map(s => s.trim());
          // Ensure both username and password exist before adding
          if (username && password) {
            return { username, password };
          }
          return null;
        })
        .filter(Boolean); // remove null entries

      if (credentials.length === 0) {
        setError("Please provide credentials in the correct format.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/check-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">IRCTC Multi-ID Checker</h1>
        <p className="mb-2">Format: <code>username,password</code> per line</p>
        <textarea
          className="w-full border border-gray-300 rounded p-2 h-40 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-50"
          placeholder="id1@example.com,password123&#10;id2@example.com,password456"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check IDs"}
        </button>

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {results.length > 0 && !loading && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Results:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {results.map((item) => (
                <li key={item.username}>
                  <strong>{item.username}</strong>: {item.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
