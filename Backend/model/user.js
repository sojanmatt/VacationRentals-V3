const mongoose = require("./mongoose");
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
let User = mongoose.model("User", UserSchema, "users");
module.exports = User;
