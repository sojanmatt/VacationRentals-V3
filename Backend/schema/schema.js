const graphql = require("graphql");
const _ = require("lodash");
var HomeAway = require("../model/homeaway");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
const bcrypt = require("bcrypt");
const saltRounds = 10;

var passport = require("passport");

const jwt = require("jsonwebtoken");

const dbName = "HomeAway";
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const loginType = new GraphQLObjectType({
  name: "login",
  fields: () => ({
    username: { type: GraphQLString }
  })
});
const signupType = new GraphQLObjectType({
  name: "signup",
  fields: () => ({
    username: { type: GraphQLString }
  })
});
const updateProfileType = new GraphQLObjectType({
  name: "updateProfile",
  fields: () => ({
    status: { type: GraphQLString }
  })
});
const bookPropertyType = new GraphQLObjectType({
  name: "bookProperty",
  fields: () => ({
    status: { type: GraphQLString }
  })
});

const Property = new GraphQLObjectType({
  name: "Property",
  fields: () => ({
    prop_id: { type: GraphQLInt },
    headline: { type: GraphQLString },
    type: { type: GraphQLString },
    location: { type: GraphQLString },
    bed: { type: GraphQLString },
    bath: { type: GraphQLString },
    startdate: { type: GraphQLString },
    enddate: { type: GraphQLString },
    currencytype: { type: GraphQLString },
    rate: { type: GraphQLString },
    minstay: { type: GraphQLString },
    maxadults: { type: GraphQLString },
    maxchild: { type: GraphQLString },
    description: { type: GraphQLString },
    unit: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
    country: { type: GraphQLString },
    address: { type: GraphQLString }
  })
});
const Tripboards = new GraphQLObjectType({
  name: "Tripboards",
  fields: () => ({
    fromDate: { type: GraphQLString },
    toDate: { type: GraphQLString },
    properties: { type: new GraphQLList(Property) }
  })
});
const Dashboard = new GraphQLObjectType({
  name: "Dashboard",
  fields: () => ({
    properties: { type: Property }
  })
});
const ProfileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    Fname: { type: GraphQLString },
    Lname: { type: GraphQLString },
    school: { type: GraphQLString },
    phone: { type: GraphQLString },
    aboutMe: { type: GraphQLString },
    company: { type: GraphQLString },
    city: { type: GraphQLString },
    hometown: { type: GraphQLString },
    languages: { type: GraphQLString },
    gender: { type: GraphQLString },
    isTraveler: { type: GraphQLString },
    isOwner: { type: GraphQLString }
  })
});
const PropertySearchType = new GraphQLObjectType({
  name: "PropertySearch",
  fields: () => ({
    properties: { type: GraphQLString }
  })
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    login: {
      type: loginType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        var user = {
          name: args.name,
          password: args.password
          //  id: args.id
        };
        return new Promise((resolve, reject) => {
          console.log("args", user);
          MongoClient.connect(
            url,
            {
              poolSize: 10
              // other options can go here
            },
            function(err, client) {
              if (err) {
                res.writeHead(400, {
                  "Content-Type": "text/plain"
                });
                res.end("Invalid Credentials");
                throw err;
              } else {
                var username = user.name;

                const db = client.db(dbName);
                console.log("Database Connected");
                db.collection("HomeAway").findOne(
                  { "user.username": username },
                  function(findErr, result) {
                    if (findErr) {
                      res.writeHead(400, {
                        "Content-Type": "text/plain"
                      });
                      res.end("Invalid Credentials");
                      throw findErr;
                    } else {
                      console.log("USERNME", user);
                      bcrypt.compare(
                        user.password,
                        result.user.password,
                        function(err, answer) {
                          console.log("USERNME bcrypt", user);
                          //  let answer = (result.password === password)
                          console.log("answer is " + JSON.stringify(answer));
                          if (answer) {
                            console.log("Herethree");
                            const body = {
                              _id: user.name,
                              type: "traveler"
                            };
                            const token = jwt.sign(
                              { user: body },
                              "verified_homeawayUser"
                            );

                            console.log("Successfully retrieving User");
                            console.log(
                              "Username is " + JSON.stringify(username)
                            );
                            // res.status(200).send(token);
                            //  res.end("Successful Login");
                            var result = {
                              username: token
                            };
                            resolve(result);
                          } //if
                          else {
                            var result = {
                              username: "username"
                            };

                            resolve(result);
                          }
                        }
                      ); //bcrypt
                    } //else
                  }
                ); //db collection
              } //else
            }
          );
        });
      }
    },
    ownerlogin: {
      type: loginType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        var user = {
          name: args.name,
          password: args.password,
          id: args.id
        };
        return new Promise((resolve, reject) => {
          console.log("args", user);
          MongoClient.connect(
            url,
            {
              poolSize: 10
              // other options can go here
            },
            function(err, client) {
              if (err) {
                resolve(err);
              } else {
                var username = user.name;

                const db = client.db(dbName);
                console.log("Database Connected");
                db.collection("HomeAway").findOne(
                  { "user.username": username },
                  function(findErr, result) {
                    if (findErr) {
                      resolve(findErr);
                    } else {
                      console.log("Owner login USERNME", user);
                      bcrypt.compare(
                        user.password,
                        result.user.password,
                        function(err, answer) {
                          console.log("USERNME bcrypt", user);
                          //  let answer = (result.password === password)
                          console.log("answer is " + JSON.stringify(answer));
                          if (answer) {
                            console.log("Herethree");
                            const body = {
                              _id: user.name,
                              type: "owner"
                            };
                            const token = jwt.sign(
                              { user: body },
                              "verified_homeawayUser"
                            );

                            console.log("Successfully retrieving User");
                            console.log(
                              "Username is " + JSON.stringify(username)
                            );
                            // res.status(200).send(token);
                            //  res.end("Successful Login");
                            var result = {
                              username: token
                            };
                            resolve(result);
                          } //if
                          else {
                            var result = {
                              username: "username"
                            };

                            resolve(result);
                          }
                        }
                      ); //bcrypt
                    } //else
                  }
                ); //db collection
              } //else
            }
          );
        });
      }
    },
    search: {
      //  type: PropertySearchType,
      type: new GraphQLList(Property),
      // type: PropertySearchType,
      args: {
        location: { type: GraphQLString },
        fromDate: { type: GraphQLString },
        toDate: { type: GraphQLString },
        adults: { type: GraphQLInt },
        children: { type: GraphQLInt }
      },
      resolve(parent, args) {
        var searchdata = {
          location: args.location,
          fromDate: args.fromDate,
          toDate: args.toDate,
          adults: args.adults,
          children: args.children
        };
        return new Promise((resolve, reject) => {
          console.log("args", searchdata);
          var pipeline = [
            {
              $unwind: "$properties"
            },
            {
              $match: {
                "properties.city": searchdata.location
              }
            },
            {
              $project: {
                properties: "$properties",
                _id: 0
              }
            },
            {
              $group: {
                _id: "$_id:",
                properties: { $push: "$properties" }
                //size: { $sum: 1 }
              }
            }
          ];

          var promise = HomeAway.aggregate(pipeline).exec();
          promise
            .then(function(data) {
              console.log("places dashboard data-");
              console.log(data[0].properties);
              // results.value = data;
              if (data) {
                // results.code = 200;
                //res.status(200).send(results);
                // var result = {
                //   properties: data[0].properties
                // };
                resolve(data[0].properties);
                // callback(null, res);
              }
            })

            .catch(function(err) {
              // just need one of these
              console.log("error:", err.message);
              var result = {
                properties: null
              };
              resolve(result);
              //   results.code = "400";
              //   res.status(400).send(results);
              //callback(err, res);
            });
        });
      }
    },
    selectedproperty: {
      //  type: PropertySearchType,
      type: new GraphQLList(Property),
      // type: PropertySearchType,
      args: {
        prop_id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        var searchdata = {
          prop_id: args.prop_id
        };
        return new Promise((resolve, reject) => {
          console.log("args", searchdata);

          HomeAway.findOne(
            { "properties.prop_id": searchdata.prop_id },
            {
              _id: 0,
              properties: { $elemMatch: { prop_id: searchdata.prop_id } }
            },
            function(findErr, result) {
              console.log("Query Output", result);
              if (findErr) {
                // results.code = "400";
                // results.value = "Failed Login";
                // console.log(results.value);
                // throw findErr;
                resolve(findErr);
                //  res.status(200).send(results);
              } //if
              else {
                console.log("-----------------------------------");
                console.log("RESULT IS - ", result);
                //results.code = "200";
                //  results.value = result;
                //  res.status(200).send(results);
                resolve(result.properties);
              }
            }
          );
        });
      }
    },
    latestbooking: {
      type: new GraphQLList(Tripboards),
      //type: new GraphQLList(Property),
      // type: PropertySearchType,
      args: {
        username: { type: GraphQLString }
      },
      resolve(parent, args) {
        var searchdata = {
          username: args.username
        };
        return new Promise((resolve, reject) => {
          console.log("latest bookings args", searchdata);
          var pipeline = [
            // Initial document match (uses index, if a suitable one is available)
            {
              $match: {
                "user.username": {
                  $eq: searchdata.username
                }
              }
            },
            {
              $project: {
                bookings: "$bookings",
                _id: 0
              }
            }
            // Expand the scores array into a stream of documents
            //  { $unwind: "$bookings" }
          ];
          var promise = HomeAway.aggregate(pipeline).exec();
          promise
            .then(function(data) {
              console.log("traveler tripboards data-");
              console.log(data[0].bookings);
              // results.value = data;
              if (data) {
                // results.code = 200;
                resolve(data[0].bookings);
                //   for()
              }
              // res.status(200).send(results);
            })
            .catch(function(err) {
              // just need one of these
              console.log("error:", err.message);
              resolve("err");
              // results.code = "400";
              // res.status(400).send(results);
            });
        });
      }
    },
    ownerdashboard: {
      type: new GraphQLList(Dashboard),
      //type: new GraphQLList(Property),
      // type: PropertySearchType,
      args: {
        username: { type: GraphQLString }
      },
      resolve(parent, args) {
        var searchdata = {
          username: args.username //"sojan" //args.username
        };
        return new Promise((resolve, reject) => {
          console.log("owner  dashboard args", searchdata);
          var pipeline = [
            // Initial document match (uses index, if a suitable one is available)
            {
              $match: {
                "user.username": {
                  $eq: searchdata.username
                }
              }
            },
            {
              $project: {
                properties: "$properties",
                _id: 0
              }
            },

            // Expand the scores array into a stream of documents
            { $unwind: "$properties" },

            {
              $sort: {
                "properties.prop_id": -1
              }
            }
          ];
          var promise = HomeAway.aggregate(pipeline).exec();
          promise
            .then(function(data) {
              console.log("owner dashboard data-");
              console.log(data);
              // results.value = data;
              if (data) {
                //  console.log("owner dashboard data", data);
                resolve(data);
              }
            })
            .catch(function(err) {
              // just need one of these
              console.log("error:", err.message);
              resolve("error");
            });
        });
      }
    },

    getprofile: {
      type: ProfileType,

      args: {
        username: { type: GraphQLString }
      },
      resolve(parent, args) {
        var searchdata = {
          username: args.username
        };
        return new Promise((resolve, reject) => {
          console.log("get profile args", searchdata);
          HomeAway.findOne(
            { "user.username": searchdata.username },
            { user: 1, _id: 0 },
            function(err, user) {
              if (user) {
                // results.code = "200";
                // results.value = user;
                console.log("profile data", user.user);
                resolve(user.user);
                // console.log(results.value);
                //res.status(200).send(results);
              } else {
                // results.code = "400";
                // results.value = "Could not find User";
                // console.log(res.value);
                // res.status(400).send(results);
                var result = null;
                resolve(result);
              }
            }
          );
        });
      }
    }
  }
});

var count = 10;
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: signupType,
      args: {
        fname: { type: GraphQLString },
        password: { type: GraphQLString },
        lname: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = {
          fname: args.fname,
          lname: args.lname,
          password: args.password,
          email: args.email
        };
        return new Promise((resolve, reject) => {
          console.log("signup user ", user);
          bcrypt.hash(user.password, saltRounds, function(err, hash) {
            hashed_password = hash;

            var myobj = new HomeAway({
              user: {
                username: user.email,
                password: hashed_password,
                Fname: user.fname,
                Lname: user.lname,
                isTraveler: true
              }
            });

            var promise = myobj.save();

            promise
              .then(function() {
                // results.value = req.body;
                //  results.code = 200;
                const body = { _id: user.email, type: "traveler" };
                const token = jwt.sign({ user: body }, "verified_homeawayUser");
                //res.status(200).send(token);

                //  callback(null, res);
                var result = {
                  username: token
                };
                resolve(result);
              })

              .catch(function(err) {
                console.log("error:", err.message);
                // if (err.message.includes("username_1 dup key:"))
                //   results.value = "This username already exists!";
                // else
                //   results.value = "Error in registering data please try again!";

                // results.code = 400;
                // //    res.status(400).send(results);
                var result = {
                  status: null
                };
                resolve(result);
                // callback(null, res);
              });
          });
        });
      }
    },
    ownersignup: {
      type: signupType,
      args: {
        fname: { type: GraphQLString },
        password: { type: GraphQLString },
        lname: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = {
          fname: args.fname,
          lname: args.lname,
          password: args.password,
          email: args.email
        };
        return new Promise((resolve, reject) => {
          console.log("owner signup user ", user);
          bcrypt.hash(user.password, saltRounds, function(err, hash) {
            hashed_password = hash;

            var myobj = new HomeAway({
              user: {
                username: user.email,
                password: hashed_password,
                Fname: user.fname,
                Lname: user.lname,
                isOwner: true
              }
            });

            var promise = myobj.save();

            promise
              .then(function() {
                // results.value = req.body;
                //  results.code = 200;

                const body = { _id: user.email, type: "owner" };
                const token = jwt.sign({ user: body }, "verified_homeawayUser");

                //res.status(200).send(token);

                //  callback(null, res);
                var result = {
                  username: token
                };
                resolve(result);
              })

              .catch(function(err) {
                console.log("error:", err.message);
                // if (err.message.includes("username_1 dup key:"))
                //   results.value = "This username already exists!";
                // else
                //   results.value = "Error in registering data please try again!";

                // results.code = 400;
                // //    res.status(400).send(results);
                var result = {
                  status: null
                };
                resolve(result);
                // callback(null, res);
              });
          });
        });
      }
    },
    bookProperty: {
      type: bookPropertyType,
      args: {
        fromDate: { type: GraphQLString },
        toDate: { type: GraphQLString },
        prop_id: { type: GraphQLInt },
        userId: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log("book property args", args);
        var user = {
          fromDate: args.fromDate,
          toDate: args.toDate,
          prop_id: args.prop_id,
          userId: args.userId
        };
        return new Promise((resolve, reject) => {
          console.log("book property user ", user);
          HomeAway.findOne(
            { "properties.prop_id": user.prop_id },
            {
              _id: 0,
              properties: { $elemMatch: { prop_id: user.prop_id } }
            },
            function(err, results) {
              if (err) {
                // results.code = "400";
                //  results.value = "Could not Book Property";
                // console.log(results.value);
                // res.status(400).send(results);
                var result = {
                  status: "400"
                };
                resolve(result);
              } else {
                // res.code = "200";
                //results.value = user;
                // console.log(user);

                console.log("valueof property is", results);

                HomeAway.findOneAndUpdate(
                  { "user.username": user.userId },
                  {
                    $push: {
                      bookings: {
                        properties: results.properties,
                        fromDate: user.fromDate,
                        toDate: user.toDate
                      }
                    }
                  },
                  function(err, result1) {
                    if (err) {
                      //  results.code = "400";
                      //   results.value = "Could not Book Property";
                      // console.log(results.value);
                      // res.code = "200";
                      // res.value = user;
                      // console.log(user);
                      let result = {
                        status: "unsuccessfull"
                      };
                      resolve(result);
                      // console.log(res.value);
                    } else {
                      //results.code = "200";
                      // results.value = result;
                      console.log("booked prop", result1);
                      console.log("valueof booked property is", result1);
                      let result = {
                        status: "Property Booked Succesfully" //result1.value
                      };
                      resolve(result);
                      //  res.status(200).send({ message: "property booked successfully" });
                    }
                  }
                );
              }

              // callback(null, res);
            }
          );
        });
      }
    },
    updateprofile: {
      type: updateProfileType,
      args: {
        username: { type: GraphQLString },

        school: { type: GraphQLString },
        phone: { type: GraphQLString },
        aboutMe: { type: GraphQLString },
        company: { type: GraphQLString },
        city: { type: GraphQLString },
        hometown: { type: GraphQLString },
        languages: { type: GraphQLString },
        gender: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log("update profile args", args);
        var user = {
          username: args.username,
          school: args.school,
          aboutMe: args.aboutMe,
          company: args.company,
          city: args.city,
          hometown: args.hometown,
          languages: args.languages,
          gender: args.gender
        };
        return new Promise((resolve, reject) => {
          console.log("update profile user ", user);
          HomeAway.findOneAndUpdate(
            { "user.username": user.username },
            {
              $set: {
                "user.school": user.school,

                "user.aboutMe": user.aboutMe,
                "user.company": user.company,
                "user.hometown": user.hometown,
                "user.languages": user.languages,
                "user.gender": user.gender,
                "user.city": user.city
                //   "user.country": msg.profile.country,
                //   "user.address": msg.address
              }
            },
            { new: true },
            function(err, result) {
              if (err) {
                console.log("profile update errl", err);
                resolve(err);
              } else {
                // res.code = "200";
                // res.value = result;
                console.log(result);
                var results = {
                  status: "Profile update successfully"
                };
                resolve(results);
              }
            }
          );
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
