const { COINGECKO_API_ENDPOINT } = require("../config/params");

const appendParams = (url, params) => {
  let appendedUrl = url;
  const tupleMap = Object.entries(params);
  const tupleMapLen = tupleMap.length;
  if (tupleMapLen > 0) {
    appendedUrl += "?";
  }
  tupleMap.forEach(([key, value], index) => {
    if (key !== null && value !== null) {
      appendedUrl += `${key}=${value}`;
      if (index < tupleMapLen - 1) {
        appendedUrl += "&";
      }
    }
  });
  return appendedUrl;
};

const coingeckoApiEndpoint = () => {
  return COINGECKO_API_ENDPOINT;
};

module.exports = {
  appendParams,
  coingeckoApiEndpoint,
};
