import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState(`make coplitkal,Itsgoodforyou@12\ngaganamtrimurtulu,Itsgoodforyou@12`);
  const [results, setResults] = useState([]);

  const checkIDs = async () => {
    const lines = input.split("\n").filter(Boolean);
    const credentials = lines.map(line => {
      const [username, password] = line.split(",");
      return { username: username.trim(), password: password.trim() };
    });

    const res = await fetch("/api/check-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentials }),
    });

    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">IRCTC Multi-ID Checker</h1>
        <textarea
          className="w-full h-40 p-2 border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={checkIDs}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check IDs
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Results:</h2>
            <ul className="mt-2 space-y-2">
              {results.map((r, i) => (
                <li key={i}>
                  <b>{r.username}</b>: {r.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
