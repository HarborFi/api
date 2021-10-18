const { supportedTokens } = require("../config/params");

const getTokenId = (symbol) => {
  if (symbol == "JOE") {
    return "joe";
  } else if (symbol == "PNG") {
    return "pangolin";
  } else if (symbol == "QI") {
    return "benqi";
  } else if (symbol == "SNOB") {
    return "snowball";
  } else if (symbol == "SPELL") {
    return "spell-token";
  } else if (symbol == "YAK") {
    return "yield-yak";
  } else {
    return undefined;
  }
};

const getTokenInfo = (symbol) => {
  return supportedTokens.find((row) => row.symbol === symbol);
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

module.exports = {
  getTokenId,
  getTokenInfo,
  asyncForEach,
};
