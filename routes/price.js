const express = require("express");
const router = express.Router();
const {
  getCurrentTokenPriceBySymbol,
  getCurrentTokenPrices,
  getHistoricalTokenPriceBySymbol,
  getHistoricalTokenPrices,
} = require("../controllers/price");

router.get("/", (req, res) => {
  res.status(200).json({
    data: "OK",
  });
});

/*
 * @route   GET /api/prices/current
 * @desc    Get Token Price
 * @params  tokenSymbol: token symbol
 * @access  Public
 */
router.get("/current", getCurrentTokenPriceBySymbol);

/*
 * @route   GET /api/prices/current/all
 * @desc    Get Token Prices
 * @access  Public
 */
router.get("/current/all", getCurrentTokenPrices);

/*
 * @route   GET /api/prices/history
 * @desc    Get Historical Token Price
 * @params  tokenSymbol: token symbol
 * @params  days: data up to number of days ago
 * @access  Public
 */
router.get("/history", getHistoricalTokenPriceBySymbol);

/*
 * @route   GET /api/prices/history/all
 * @desc    Get Historical Token Prices
 * @params  days: data up to number of days ago
 * @access  Public
 */
router.get("/history/all", getHistoricalTokenPrices);

module.exports = router;
