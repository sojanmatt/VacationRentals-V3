const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, trim: true, index: { unique: true } },
  //email: { type: String, trim: true, index: { unique: true } },
  password: { type: String, required: true },
  Fname: { type: String, trim: true, default: "" },
  Lname: { type: String, trim: true, default: "" },
  school: { type: String, trim: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  aboutMe: { type: String, trim: true, default: "" },
  company: { type: String, trim: true, default: "" },
  city: { type: String, trim: true, default: "" },
  hometown: { type: String, trim: true, default: "" },
  languages: { type: String, trim: true, default: "" },
  gender: { type: String, trim: true, default: "" },
  isTraveler: { type: Boolean, trim: true, default: `0` },
  isOwner: { type: Boolean, trim: true, default: `0` }
});

var Listings = new Schema({
  // username: { type: String, trim: true },
  listing_id: { type: Number, trim: true },
  fromDate: { type: String, trim: true, default: "" },
  toDate: { type: String, trim: true, default: "" }
});
var Messages = new Schema({
  prop_id: { type: Number, trim: true },
  message_id: { type: Date, trim: true },
  message: { type: String },
  ownername: { type: String, trim: true },
  travelername: { type: String, trim: true }
});

var PropertySchema = new Schema({
  prop_id: { type: Number, trim: true, index: { unique: true } },
  headline: { type: String, trim: true, index: { unique: true } },
  type: { type: String, required: true },
  location: { type: String, trim: true, default: "" },
  bed: { type: Number, trim: true, default: "" },
  bath: { type: Number, trim: true, default: "" },
  startdate: { type: String, trim: true, default: "" },
  enddate: { type: String, trim: true, default: "" },
  currencytype: { type: String, trim: true, default: "" },
  rate: { type: String, trim: true, default: "" },
  minstay: { type: Number, trim: true, default: "" },
  maxadults: { type: Number, trim: true, default: "" },
  maxchild: { type: Number, trim: true, default: 0 },
  availability: { type: Boolean, trim: true, default: 0 },
  description: { type: String, trim: true, default: "" },
  unit: { type: String, trim: true, default: "" },
  city: { type: String, trim: true, default: "" },
  state: { type: String, trim: true, default: "" },
  zip: { type: String, trim: true, default: "" },
  country: { type: String, trim: true, default: "" },
  address: { type: String, trim: true, default: "" }
});
var Bookings = new Schema({
  booking_id: { type: Number, trim: true },
  fromDate: { type: String, trim: true, default: "" },
  toDate: { type: String, trim: true, default: "" },
  properties: [{ type: PropertySchema }]
});
var HomeAwaySchema = new Schema({
  user: { type: UserSchema },
  properties: [{ type: PropertySchema }],
  bookings: [{ type: Bookings }],
  //listings: [{ type: Listings }],
  messages: [{ type: Messages }]
});

let HomeAway = mongoose.model("HomeAway", HomeAwaySchema, "HomeAway");
module.exports = HomeAway;
