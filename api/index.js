const fs = require("fs").promises;
const path = require("path");
const url = require("url");

let config = null;

async function loadConfig() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'dev-mock-server-config.json'), 'utf8');
    config = JSON.parse(data);
  } catch (err) {
    console.error("Error reading config file:", err);
    throw err;
  }
}

module.exports = async (req, res) => {
  try {
    if (!config) {
      await loadConfig();
    }

    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method;

    const endpoint = config.api.find(
      (api) => api.path === pathname && (api.method === method || method === 'OPTIONS')
    );

    if (!endpoint) {
      res.status(404).json({ error: "Not Found" });
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', `OPTIONS, ${endpoint.method}`);
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', 3600);

    if (method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (endpoint.authorization && req.headers.authorization !== `Bearer ${endpoint.authorization.token}`) {
      res.status(endpoint.authorization.status).json(endpoint.authorization.unauthorized);
      return;
    }

    res.status(200).json(endpoint.response);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};