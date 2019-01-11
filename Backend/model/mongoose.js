const mongoose = require("mongoose");
const options = {
  poolSize: 10
};
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/HomeAway",
  options
);
module.exports = mongoose;
