import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleCheck = async () => {
    const lines = input.trim().split("\n");
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
    <div className="min-h-screen p-10 bg-gray-100 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">IRCTC Multi-ID Checker</h1>
        <p className="mb-2">Format: <code>email,password</code> per line</p>
        <textarea
          className="w-full border border-gray-300 rounded p-2 h-40 mb-4"
          placeholder="id1@example.com,password123"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Check IDs
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Results:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {results.map((item, index) => (
                <li key={index}>
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
