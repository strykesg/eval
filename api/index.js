const fs = require("fs").promises;
const url = require("url");

let config = null;

async function loadConfig() {
  try {
    const data = await fs.readFile('./dev-mock-server-config.json', 'utf8');
    config = JSON.parse(data);
  } catch (err) {
    console.error("Error reading config file:", err);
  }
}

loadConfig();

module.exports = async (req, res) => {
  if (!config) {
    await loadConfig();
  }

  const requestUrl = url.parse(req.url, true);
  const endpoint = config.api.find(
    (api) => api.path === requestUrl.pathname && (api.method === req.method || req.method === 'OPTIONS')
  );

  // endpoint not found
  if (!endpoint) {
    res.status(404).send("Not Found");
    return;
  }

  // handle cors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', `OPTIONS, ${endpoint.method}`);
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', 3600);

  if(req.method === 'OPTIONS'){
    res.status(200).end();
    return;
  }

  // endpoint requires authorization
  if (
    endpoint.authorization &&
    req.headers.authorization !== `Bearer ${endpoint.authorization.token}`
  ) {
    res.status(endpoint.authorization.status).json(endpoint.authorization.unauthorized);
    return;
  }

  res.status(200).json(endpoint.response);
};