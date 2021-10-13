// const moment = require("moment");
const axios = require("axios");
const { coingeckoApiEndpoint, appendParams } = require("../utils/axios");
const { getTokenId, getTokenInfo } = require("../utils/token");
const { supportedTokens } = require("../config/params");
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

const getCurrentSharePrice = async (req, res, next) => {
  const tokenPricesRow = await TokenPrice.find({});

  let sharePrice = 0;

  tokenPricesRow.map((row) => {
    const _tokenInfo = getTokenInfo(row.symbol);
    if (_tokenInfo && _tokenInfo.shareWeight) {
      sharePrice += _tokenInfo.shareWeight * row.price;
    }
    return {
      symbol: row.symbol,
      price: row.price,
    };
  });

  res.status(200).json({
    success: true,
    data: sharePrice,
  });
};

const getCurrentTokenPrices = async (req, res, next) => {
  const tokenPricesRow = await TokenPrice.find({});

  let tokenPrices = {};
  tokenPricesRow.map((row) => {
    tokenPrices[row.address] = row.price;
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
  const { days } = req.query;

  const tokenHistoricalPrices = await Promise.all(
    supportedTokens.map(async (token) => {
      const tokenId = getTokenId(token.symbol);
      const url = appendParams(
        `${coingeckoApiEndpoint()}/v3/coins/${tokenId}/market_chart`,
        {
          ids: tokenId,
          vs_currency: "usd",
          days: days || 1,
        }
      );
      let historicalPrices = [];

      try {
        const cgcRes = await axios.get(url);

        if (cgcRes.status === 200) {
          historicalPrices = cgcRes.data.prices;
        }
      } catch (err) {
        console.log("historical price fetch error--->", token, err);
      }

      return {
        symbol: token,
        prices: historicalPrices,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: tokenHistoricalPrices,
  });
};

module.exports = {
  getCurrentTokenPriceBySymbol,
  getCurrentSharePrice,
  getCurrentTokenPrices,
  getHistoricalTokenPriceBySymbol,
  getHistoricalTokenPrices,
};
