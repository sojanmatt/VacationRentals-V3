const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

var BidsSchema = new Schema({
  username: { type: String, trim: true },
  name: { type: String, trim: true },
  bid_price: { type: Number, trim: true },
  days_req: { type: Number, trim: true }
});

// create a schema
var PropertySchema = new Schema({
  prop_id: { type: Number, trim: true, index: { unique: true } },
  username: { type: String, trim: true },
  country: { type: String, trim: true },
  description: { type: String, trim: true, default: "" },
  address: { type: String, trim: true, default: "" },
  unit: { type: String, trim: true, default: "" },
  status: { type: String, trim: true, default: "" },
  complete_by: { type: String, trim: true, default: "" },
  filenames: { type: String, trim: true, default: "" },
  freelancer_username: { type: String, trim: true, default: "" },
  bids: [{ type: BidsSchema }],
  freelancer_files: { type: String, trim: true, default: "" }
});

let Property = mongoose.model("Property", PropertySchema, "properties");
module.exports = Property;
