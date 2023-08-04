const https = require("https");
const secrets = process.env;

const configOptions = {
  [SERVICES.VAULT]: {
    baseURL: `${secrets.VAULT_CORE_URL}${secrets.VAULT_BASE_URL}`,
    headers: [{ ...TM_VAULT_HEADERS }],
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  },
};

module.exports = configOptions;
