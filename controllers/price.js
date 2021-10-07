// const moment = require("moment");
const axios = require("axios");
const { coingeckoApiEndpoint, appendParams } = require("../utils/axios");
const { getTokenId, asyncForEach } = require("../utils/token");
const { TokenPrice } = require("../models/TokenPrice");

const getCurrentTokenPriceBySymbol = async (req, res, next) => {
  const { tokenSymbol } = req.query;
  const tokenPriceRow = await TokenPrice.findOne({ symbol: tokenSymbol });

  if (tokenPriceRow) {
    res.status(200).json({
      success: true,
      data: tokenPriceRow.price,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Token symbol is incorrect",
    });
  }
};

const getCurrentTokenPrices = async (req, res, next) => {
  const tokenPricesRow = await TokenPrice.find({});

  const tokenPrices = tokenPricesRow.map((row) => {
    return {
      symbol: row.symbol,
      price: row.price,
    };
  });

  res.status(200).json({
    success: true,
    data: tokenPrices,
  });
};

const getHistoricalTokenPriceBySymbol = async (req, res, next) => {
  const { tokenSymbol, days } = req.query;
  const tokenId = getTokenId(tokenSymbol);
  if (!tokenId) {
    res.status(400).json({
      success: false,
      message: "Token symbol is incorrect",
    });
  }

  const url = appendParams(
    `${coingeckoApiEndpoint()}/v3/coins/${tokenId}/market_chart`,
    {
      ids: tokenId,
      vs_currency: "usd",
      days: days || 1,
    }
  );

  const cgcRes = await axios.get(url);
  if (cgcRes.status === 200) {
    const historicalPrices = cgcRes.data.prices;
    res.status(200).json({
      success: true,
      data: historicalPrices,
    });
  }
  res.status(400).json({
    success: false,
    data: [],
  });
};

const getHistoricalTokenPrices = async (req, res, next) => {
  const tokenPricesRow = await TokenPrice.find({});

  const tokenPrices = tokenPricesRow.map((row) => {
    return {
      symbol: row.symbol,
      price: row.price,
    };
  });

  res.status(200).json({
    success: true,
    data: tokenPrices,
  });
};

module.exports = {
  getCurrentTokenPriceBySymbol,
  getCurrentTokenPrices,
  getHistoricalTokenPriceBySymbol,
  getHistoricalTokenPrices,
};
