const cron = require("node-cron");
const axios = require("axios");
const { getTokenId, asyncForEach } = require("../utils/token");
const { coingeckoApiEndpoint, appendParams } = require("../utils/axios");
const { supportedTokens } = require("../config/params");
const { TokenHistoricPrice } = require("../models/TokenHistoricPrice");

const updateHistoricTokenPrices = async () => {
  try {
    asyncForEach(supportedTokens, async (token) => {
      const tokenId = getTokenId(token.symbol);
      const url = appendParams(
        `${coingeckoApiEndpoint()}/v3/coins/${tokenId}/market_chart`,
        {
          ids: tokenId,
          vs_currency: "usd",
          days: 5,
        }
      );
      try {
        const res = await axios.get(url);

        if (res.status === 200) {
          let historicPrices = {};
          res.data.prices &&
            res.data.prices
              .sort((a, b) => a[0] > b[0])
              .map((row) => {
                const date = Math.floor(row[0] / 1000 / 86400) * 86400;
                historicPrices[date] = row[1];
                return row;
              });

          Object.entries(historicPrices).map(async (row) => {
            try {
              const tokenPriceRow = await TokenHistoricPrice.find({
                symbol: token.symbol,
                timestamp: Number(row[0]),
              });
              if (tokenPriceRow.length === 0) {
                const newTokenHistoricPrice = new TokenHistoricPrice({
                  symbol: token.symbol,
                  address: token.address,
                  price: 0,
                  timestamp: Number(row[0]),
                });
                await newTokenHistoricPrice.save();
              }

              await TokenHistoricPrice.findOneAndUpdate(
                {
                  symbol: token.symbol,
                  timestamp: Number(row[0]),
                },
                {
                  $set: {
                    price: row[1],
                  },
                }
              );

              return row;
            } catch (error) {
              console.log("Mongodb insert error:", error);
            }
          });
        }
      } catch (error) {
        console.log("Coingecko error:", error.message);
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};

// This cron should be scheduled at every 1 minute to update token price
cron.schedule("* * * * *", async () => {
  console.log("Fetching and logging token price from coingecko...");
  updateHistoricTokenPrices();
});

updateHistoricTokenPrices();
