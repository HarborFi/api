require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
const supportedTokens = [
  {
    symbol: "JOE",
    address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    shareWeight: 0.243309,
  },
  {
    symbol: "PNG",
    address: "0x60781c2586d68229fde47564546784ab3faca982",
    shareWeight: 0.52631579,
  },
  {
    symbol: "QI",
    address: "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
    shareWeight: 7.32091219,
  },
  {
    symbol: "SNOB",
    address: "0xc38f41a296a4493ff429f1238e030924a1542e50",
    shareWeight: 0.6993007,
  },
  {
    symbol: "YAK",
    address: "0x59414b3089ce2af0010e7523dea7e2b35d776ec7",
    shareWeight: 0.00006526,
  },
];
const COINGECKO_API_ENDPOINT = "https://api.coingecko.com/api";

module.exports = {
  mongoURI: process.env.NODE_ENV === "production" ? mongoURI : mongoURI,
  COINGECKO_API_ENDPOINT,
  supportedTokens,
};
