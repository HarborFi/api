const cron = require("node-cron");
const axios = require("axios");
const { getTokenId, asyncForEach } = require("../utils/token");
const { coingeckoApiEndpoint, appendParams } = require("../utils/axios");
const { supportedTokens } = require("../config/params");
const { TokenPrice } = require("../models/TokenPrice");

const updateTokenPrices = async () => {
  try {
    asyncForEach(supportedTokens, async (token) => {
      const tokenPriceRow = await TokenPrice.find({ symbol: token });
      if (tokenPriceRow.length === 0) {
        const newTokenPrice = new TokenPrice({
          symbol: token,
          price: 0,
        });
        await newTokenPrice.save();
      }

      const tokenId = getTokenId(token);
      const url = appendParams(`${coingeckoApiEndpoint()}/v3/simple/price`, {
        ids: tokenId,
        vs_currencies: "usd",
      });
      const res = await axios.get(url);

      if (res.status === 200) {
        const { [tokenId]: tokenPrice } = res.data;
        if (tokenPrice.usd) {
          const price = tokenPrice.usd;

          await TokenPrice.findOneAndUpdate(
            {
              symbol: token,
            },
            {
              $set: {
                price,
              },
            }
          );
        }
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};

// This cron should be scheduled at every 1 minute to update token price
cron.schedule("* * * * *", async () => {
  console.log("Fetching and logging token price from coingecko...");
  updateTokenPrices();
});

updateTokenPrices();
