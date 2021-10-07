require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
const supportedTokens = ["JOE", "PNG", "QI", "SNOB", "YAK"];
const COINGECKO_API_ENDPOINT = "https://api.coingecko.com/api";

module.exports = {
  mongoURI: process.env.NODE_ENV === "production" ? mongoURI : mongoURI,
  COINGECKO_API_ENDPOINT,
  supportedTokens,
};
