const mongoose = require("mongoose");
const { db } = require("../config/mongo");

const tokenPriceSchema = mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  address: { type: String },
  price: { type: Number, default: 0 },
});

tokenPriceSchema.static({
  getAllTokenPrices() {
    return this.find({});
  },
});

const TokenPrice = db.model("TokenPrice", tokenPriceSchema);

module.exports = { TokenPrice };
