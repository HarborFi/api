const mongoose = require("mongoose");
const { mongoURI } = require("../config/params");

mongoose.Promise = Promise;

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

module.exports = {
  connect: () => mongoose.connection,
  db: mongoose.connection,
};
