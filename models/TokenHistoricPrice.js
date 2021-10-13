const mongoose = require("mongoose");
const { db } = require("../config/mongo");

const tokenHistoricPriceSchema = mongoose.Schema({
  symbol: { type: String, required: true },
  address: { type: String },
  price: { type: Number, default: 0 },
  timestamp: { type: Number, required: true, default: 0 },
});

tokenHistoricPriceSchema.static({
  getAllTokenHistoricPrices() {
    return this.find({});
  },
});

const TokenHistoricPrice = db.model(
  "TokenHistoricPrice",
  tokenHistoricPriceSchema
);

module.exports = { TokenHistoricPrice };
