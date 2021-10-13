const { getTokenId, getTokenInfo } = require("../utils/token");
const { supportedTokens } = require("../config/params");
const { TokenPrice } = require("../models/TokenPrice");
const { TokenHistoricPrice } = require("../models/TokenHistoricPrice");

const _getHistoricalTokenPriceBySymbol = async ({ tokenSymbol, days }) => {
  const now = Date.now();
  const startTimestamp = (Math.floor(now / 1000 / 86400) - days) * 86400;

  const tokenHistoricPriceRow = await TokenHistoricPrice.find({
    symbol: tokenSymbol,
  });

  return (
    tokenHistoricPriceRow &&
    tokenHistoricPriceRow
      .filter((row) => row.timestamp >= startTimestamp)
      .map((row1) => {
        return {
          timestamp: row1.timestamp,
          price: row1.price,
        };
      })
  );
};

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

  const historicalPrices = await _getHistoricalTokenPriceBySymbol({
    tokenSymbol,
    days,
  });

  res.status(200).json({
    success: true,
    data: historicalPrices,
  });
};

const getHistoricalSharePrice = async (req, res, next) => {
  const { days } = req.query;
  const now = Date.now();

  const tokenHistoricalPrices = await Promise.all(
    supportedTokens.map(async (token) => {
      const historicalPrices = await _getHistoricalTokenPriceBySymbol({
        tokenSymbol: token.symbol,
        days,
      });

      return {
        symbol: token.symbol,
        prices: historicalPrices,
      };
    })
  );

  let sharePrices = {};

  for (let index = 0; index < days + 1; index++) {
    const timestamp = (Math.floor(now / 1000 / 86400) - index) * 86400;
    sharePrices[timestamp] = 0;
  }

  const pricesWithWeight = tokenHistoricalPrices.map((row) => {
    const _tokenInfo = getTokenInfo(row.symbol);
    return row.prices.map((row1) => {
      return {
        timestamp: row1.timestamp,
        price: _tokenInfo.shareWeight * row1.price,
      };
    });
  });

  pricesWithWeight.map((row) => {
    row.map((row1) => {
      sharePrices[row1.timestamp] += row1.price;
    });
  });

  res.status(200).json({
    success: true,
    data: sharePrices,
  });
};

const getHistoricalTokenPrices = async (req, res, next) => {
  const { days } = req.query;

  const tokenHistoricalPrices = await Promise.all(
    supportedTokens.map(async (token) => {
      const historicalPrices = await _getHistoricalTokenPriceBySymbol({
        tokenSymbol: token.symbol,
        days,
      });

      return {
        symbol: token.symbol,
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
  getHistoricalSharePrice,
  getHistoricalTokenPrices,
};
