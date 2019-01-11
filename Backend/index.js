//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");
let fs = require("fs");
var path = require("path");
var async = require("async");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
const dbName = "HomeAway";
const graphqlHTTP = require("express-graphql");
var HomeAway = require("./model/homeaway");
var schema = require("./schema/schema");
/*
const router = express.Router();
const secureRoute = require("./Routes/secureroute");
require('./Routes/auth');*/
//var kafka = require("./kafka/client");
var mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var pool = require("./pool");
var passport = require("passport");
require("./Routes/passport");
const jwt = require("jsonwebtoken");
/*
var travelerlogin = require("./controllers/travelerlogin");
var ownerlogin = require("./controllers/ownerlogin");
var property = require("./controllers/property");
var places = require("./controllers/places");
var bookings = require("./controllers/bookings");
var travelersignup = require("./controllers/signup");
var profile = require("./controllers/profile");
var ownersignup = require("./controllers/ownersignup");*/

// import { ownerlogin } from "./controllers/ownerlogin";
// import { property } from "./controllers/property";
// import { places } from "./controllers/places";
// import { bookings } from "./controllers/bookings";
// import { travelersignup } from "./controllers/signup";
// import { travelerlogin } from "./controllers/travelerlogin";
// import { ownersignup } from "./controllers/ownersignup";
// import { profile } from "./controllers/profile";

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

/*Secure route
app.use(
  "/myProfile/:id",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);*/
app.use(passport.initialize());
app.use(passport.session());

//method to serialize user for storage
passport.serializeUser(function(username, done) {
  done(null, username);
});

// method to de-serialize back for auth
passport.deserializeUser(function(username, done) {
  done(null, username);
});
app.use(bodyParser.json());
app.use(cookieParser());
/*var con = mysql.createPool({
  connectionLimit: 100,
  host: "127.0.0.1",
  user: "root",
  password: "qwerty@123",
  database: "testing"
});*/

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});
var prop_id = null;
/*
app.post("/login", function(req, res) {
  console.log("In traveler login handle request:", req.body);
  mongo.myconnect(mongoURL, function() {
    console.log("Connected to mongo at: " + mongoURL);
    var coll = mongo.collection("HomeAway");
    console.log("inside mongo query");
    console.log(req.body.password);
    coll.findOne({ "user.username": req.body.username }, function(err, user) {
      // console.log("result is ", JSON.stringify(user));
      console.log("Body is  " + req.body.password);
      bcrypt.compare(req.body.password, user.user.password, function(
        err,
        answer
      ) {
        if (answer) {
          const body = { _id: req.body.username, type: "traveler" };
          const token = jwt.sign({ user: body }, "verified_homeawayUser");
          res.cookie("cookie", req.body.username, {
            maxAge: 900000,
            httpOnly: false,
            path: "/"
          });
        }
      });
    });
  });
});*/

app.post("/login", function(req, res) {
  console.log("HERE");
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
        var username = req.body.username;
        // var password = req.body.password;
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
              console.log("USERNME", username);
              bcrypt.compare(req.body.password, result.user.password, function(
                err,
                answer
              ) {
                //  let answer = (result.password === password)
                console.log("answer is " + JSON.stringify(answer));
                if (answer) {
                  console.log("Herethree");
                  const body = { _id: req.body.username, type: "traveler" };
                  const token = jwt.sign(
                    { user: body },
                    "verified_homeawayUser"
                  );
                  res.cookie("cookie", req.body.username, {
                    maxAge: 9000000,
                    httpOnly: false,
                    path: "/"
                  });
                  req.session.user = result;
                  console.log("Successfully retrieving User");
                  console.log("Username is " + JSON.stringify(username));
                  res.status(200).send(token);
                  res.end("Successful Login");
                } //if
                else {
                  console.log("invalid cre");
                  // res.writeHead(400, {
                  //   "Content-Type": "text/plain"
                  // });
                  res.status(400).send({ message: "invalid credentials" });
                  // res.end("Invalid Credentials");
                }
              }); //bcrypt
            } //else
          }
        ); //db collection
      } //else
    }
  ); //mongoClient
}); //app

app.post("/ownerlogin", function(req, res) {
  console.log("Owner HERE");
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
        var username = req.body.username;
        // var password = req.body.password;
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
              console.log("USERNME", username);
              bcrypt.compare(req.body.password, result.user.password, function(
                err,
                answer
              ) {
                //  let answer = (result.password === password)
                console.log("answer is " + JSON.stringify(answer));
                if (answer) {
                  console.log("Herethree");
                  const body = { _id: req.body.username, type: "owner" };
                  const token = jwt.sign(
                    { user: body },
                    "verified_homeawayUser"
                  );
                  res.cookie("cookie", req.body.username, {
                    maxAge: 9000000,
                    httpOnly: false,
                    path: "/"
                  });
                  req.session.user = result;
                  console.log("Successfully retrieving User");
                  console.log("Username is " + JSON.stringify(username));
                  res.status(200).send(token);
                  res.end("Successful Login");
                } //if
                else {
                  // res.writeHead(400, {
                  //   "Content-Type": "text/plain"
                  // });
                  res.status(400).send("Invalid Credentials");
                }
              }); //bcrypt
            } //else
          }
        ); //db collection
      } //else
    }
  ); //mongoClient
});

app.post("/places", function(req, res) {
  var results = {};
  console.log("In fetch places handle request:", req.body);
  var pipeline = [
    {
      $unwind: "$properties"
    },
    {
      $match: {
        "properties.city": req.body.location
      }
    },
    {
      $project: {
        properties: "$properties",
        _id: 0
      }
    }
  ];

  var promise = HomeAway.aggregate(pipeline).exec();
  promise
    .then(function(data) {
      console.log("places dashboard data-");
      console.log(data);
      results.value = data;
      if (data) {
        results.code = 200;
        res.status(200).send(results);
        // callback(null, res);
      }
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      results.code = "400";
      res.status(400).send(results);
      //callback(err, res);
    });
});

app.get("/places/getselectedproperty/:id", function(req, res) {
  var results = {};
  console.log(
    "In selected property handle request:" + JSON.stringify(req.body)
  );

  HomeAway.findOne(
    { "properties.prop_id": req.params.id },
    { _id: 0, properties: { $elemMatch: { prop_id: req.params.id } } },
    function(findErr, result) {
      console.log("Query Output", result);
      if (findErr) {
        results.code = "400";
        results.value = "Failed Login";
        console.log(results.value);
        throw findErr;
        //  res.status(200).send(results);
      } //if
      else {
        console.log("-----------------------------------");
        console.log("RESULT IS - ", result);
        results.code = "200";
        results.value = result;
        res.status(200).send(results);
      }
    }
  );
});

app.post("/book-property", function(req, res) {
  console.log("property is", req.body);
  var results = {};
  console.log("In Book property handle request:", req.body);
  HomeAway.findOne(
    { "properties.prop_id": req.body.prop_id },
    {
      _id: 0,
      properties: { $elemMatch: { prop_id: req.body.prop_id } }
    },
    function(err, user) {
      if (err) {
        results.code = "400";
        results.value = "Could not Book Property";
        console.log(results.value);
        res.status(400).send(results);
      } else {
        // res.code = "200";
        results.value = user;
        // console.log(user);
        console.log("valueof property is", results.value);

        HomeAway.findOneAndUpdate(
          { "user.username": req.body.userId },
          {
            $push: {
              bookings: {
                properties: results.value.properties,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate
              }
            }
          },
          function(err, result) {
            if (err) {
              results.code = "400";
              results.value = "Could not Book Property";
              console.log(results.value);
              // res.code = "200";
              // res.value = user;
              // console.log(user);
              // console.log(res.value);
            } else {
              results.code = "200";
              results.value = result;
              console.log(results);
              console.log("valueof booked property is", results.value);
              res.status(200).send({ message: "property booked successfully" });
            }
          }
        );
      }

      // callback(null, res);
    }
  );
});
// app.post("/login", function(req, res) {
//   var res = {};
//   console.log("In traveler login handle request:" + JSON.stringify(req));
//   mongo.myconnect(mongoURL, function() {
//     console.log("Connected to mongo at: " + mongoURL);
//     var coll = mongo.collection("HomeAway");
//     console.log("inside mongo query");
//     // key = "273";
//     //  var hash = crypto.createHmac("sha512", key); //encrytion using SHA512
//     //  hash.update(msg.password);
//     //    msg.password = hash.digest("hex");
//     console.log(req.body.password);
//     coll.findOne({ "user.username": req.body.username }, function(err, user) {
//       // console.log("result is ", JSON.stringify(user));
//       console.log("Body is  " + req.body.password);
//       bcrypt.compare(req.body.password, user.user.password, function(
//         err,
//         answer
//       ) {
//         console.log("answer is " + JSON.stringify(answer));
//         if (answer) {
//           const body = { _id: req.body.username, type: "traveler" };
//           const token = jwt.sign({ user: body }, "verified_homeawayUser");
//           res.cookie("cookie", req.body.username, {
//             maxAge: 900000,
//             httpOnly: false,
//             path: "/"
//           });
//           req.session.user = result;
//           var decoded = jwtDecode(token);
//           var tid = decoded.user.type;
//           console.log("Successfully retrieving traveler login", tid);
//           console.log("req.body.username", JSON.stringify(req.body.username));

//           res.status(200).send(token);
//         }
//       });

//       console.log("inside try:" + JSON.stringify(res));
//       //    callback(null, res);
//     });
//   });
// });

// app.post("/login", (req, res) => {
//   travelerlogin.login(req, res);
// });
/*
app.post("/traveller/signup", (req, res) => {
  travelersignup.travelersignup(req, res);
});
app.post("/ownerlogin", (req, res) => {
  ownerlogin.ownerlogin(req, res);
});
app.post("/owner/signup", (req, res) => {
  console.log("inside owner post");
  ownersignup.ownersignup(req, res);
});

app.get("/myProfile/:id", (req, res) => {
  profile.getmyprofile(req, res);
});*/
// app.get("/getPropid", (req, res) => {
//   property.getpropertyid(req, res);
// });
// app.post("/getPropertyImg", (req, res) => {
//   property.getpropertyimage(req, res);
// });
// app.post("/getSelectedPropertyImg", (req, res) => {
//   property.getselectedpropertyimage(req, res);
// });
/*
app.post("/editprofile/save", (req, res) => {
  profile.updateprofile(req, res);
});
*/
// app.post("/editprofile/save", (req, res) => {
//   profile.updateprofile(req, res);
// });
/*
app.post("/book-property", (req, res) => {
  bookings.bookproperty(req, res);
});*/
// app.post("/editprofile/save", (req, res) => {
//   profile.updateprofile(req, res);
// });
/*
app.post("/places", (req, res) => {
  places.getplaces(req, res);
});
app.get("/places/getListings/:id", (req, res) => {
  property.getlistings(req, res);
});

app.get("/places/getselectedproperty/:id", (req, res) => {
  bookings.getselectedpropertydetail(req, res);
});
app.get("/places/latestbookings/:id", (req, res) => {
  bookings.getlatestbookings(req, res);
});

app.get("/properties/latestlistings/:id", (req, res) => {
  property.getlatestlistings(req, res);
});
app.post("/list-property", (req, res) => {
  property.listproperty(req, res);
});

app.post("/ask-question", (req, res) => {
  bookings.askaquestion(req, res);
});

app.post("/get-questions", (req, res) => {
  bookings.getquestions(req, res);
});

app.post("/get-traveler-questions", (req, res) => {
  bookings.gettravelerquestions(req, res);
});
*/

/*
app.post("/login", function(req, res) {
  passport.authenticate("login", function(err, user) {
    if (!user) {
      console.log("CHECK: " + user);
      res.status(201).json({ output: 0 });
    } else {
      console.log("User Verified: " + JSON.stringify(user));
      const body = { _id: user.username };
      //Sign the JWT token and populate the payload with the user email and id
      const token = jwt.sign({ user: body }, "verified_homeawayUser");
      req.session.user = user.username;
      res.cookie("cookie",  user.username, {
        maxAge: 900000,
        httpOnly: false,
        path: "/"
      });
      //console.log("Session initialised: "+req.session.user);
      //req.session.save();
      res.status(201).send({ output: token });
    }
  })(req, res);
});
*/
/*
app.post("/users/authenticate", function(req, res) {
  passport.authenticate("login", function(err, user) {
    if (err) {
      res.status(500).send();
    }

    if (!user) {
      res.statusMessage =
        "Username does not exist. Please double-check and try again.";
      res.status(400).send();
    } else {
      req.login(user.username, function(err) {
        if (err) {
          console.log(err);
        }
        req.session.username = user.username;
        console.log(req);
        console.log("session initilized");
        res.status(200).send({ user: user });
      });
    }
  })(req, res);
});
*/

//Route to handle Post Request Call
/* mongo login 
app.post("/login", function(req, res) {
  console.log("Inside Login Post Request");
  console.log("reqis", req.body.username);
  MongoClient.connect(
    url,
    function(err, client) {
      if (err) throw err;
      else {
        var db = client.db(dbname);
        console.log("Connected!");
        console.log("req.body.username", req.body.username);
        console.log("req.body.password", req.body.password);

        var username = req.body.username;
        var password = req.body.password;
        db.collection("HomeAway").findOne({ username: username }, function(
          err,
          result
        ) {
          if (err) {
            res.writeHead(400, {
              "Content-Type": "text/plain"
            });
            res.end("Invalid Credentials");
          } else {
            console.log("result0", result);
            if (result) {
              console.log("result is " + result.password);
              console.log("Body is  " + req.body.password);
              bcrypt.compare(req.body.password, result.password, function(
                err,
                answer
              ) {
                console.log("answer is " + JSON.stringify(answer));
                if (answer) {
                  res.cookie("cookie", req.body.username, {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/"
                  });
                  req.session.user = result;
                  console.log("Successfully retrieving");
                  console.log(
                    "req.body.username",
                    JSON.stringify(req.body.username)
                  );

                  res.status(200).send(JSON.stringify(req.body.username));
                  res.end("Successful Login");
                } else {
                  res.writeHead(400, {
                    "Content-Type": "text/plain"
                  });
                  res.end("Invalid Credentials");
                }
              });
            } else {
              console.log("400");
              res.status(400).send({ message: "Invalid Credentials !" });
              // res.writeHead(400, {
              //   "Content-Type": "text/plain"
              // });
              // res.end("Invalid Credentials");
            }

            // res.cookie("cookie", "admin", {
            //   maxAge: 900000,
            //   httpOnly: false,
            //   path: "/"
            // });
            // console.log("cookie", res.cookie);
            // req.session.user = result[0];
            // console.log("result", result);
            // console.log("req.session.user", req.session.user);
            // res.writeHead(200, {
            //   "Content-Type": "text/plain"
            // });
            // res.end(JSON.stringify(result));
            // console.log("result login", result);
          }
        });
      }
    }
  );
});
*/
/*Kafka login*/
/*
app.post("/login", function(req, res) {
  console.log("Inside Login Post Request");
  console.log("reqis", req.body.username);
  kafka.make_request(
    "traveler_login_topic",
    { username: req.body.username, password: req.body.password },
    function(err, result) {
      console.log("in result");
      //  console.log(results);
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        res.cookie("cookie", req.body.username, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        console.log("Successfully retrieving");
        res.status(200).send(JSON.stringify(req.body.username));
      }
    }
  );
});
/
app.post("/ownerlogin", function(req, res) {
  console.log("Inside Owner Login Post Request");

  kafka.make_request(
    "owner_login_topic",
    { username: req.body.username, password: req.body.password },
    function(err, result) {
      console.log("Connected!");
      console.log("req.body.username", req.body.username);
      console.log("req.body.password", req.body.password);

      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        res.cookie("cookieOwner", req.body.username, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = result;
        console.log("Successfully retrieving");
        console.log("req.body.username", JSON.stringify(req.body.username));

        res.status(200).send(JSON.stringify(req.body.username));
        res.end("Successful Login");
        console.log("result0", result[0]);
      } //else
    }
  );
});
/** 
app.post("/ownerlogin", function(req, res) {
  console.log("Inside Owner Login Post Request");

  con.getConnection(function(err) {
    if (err) throw err;
    console.log("Connected!");
    console.log("req.body.username", req.body.username);
    console.log("req.body.password", req.body.password);

    var username = req.body.username;
    var password = req.body.password;
    var sql =
      "SELECT password  FROM homeaway.user_details WHERE username = " +
      mysql.escape(username) +
      " and isOwner=1";
    // +
    // "and password = " +
    // mysql.escape(password)
    console.log("sql for login", sql);
    con.query(sql, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        console.log("result0", result[0]);
        if (result[0]) {
          console.log("result is " + result[0].password);
          console.log("Body is  " + req.body.password);
          bcrypt.compare(req.body.password, result[0].password, function(
            err,
            answer
          ) {
            console.log("answer is " + JSON.stringify(answer));
            if (answer) {
              res.cookie("cookieOwner", req.body.username, {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              req.session.user = result;
              console.log("Successfully retrieving");
              console.log(
                "req.body.username",
                JSON.stringify(req.body.username)
              );

              res.status(200).send(JSON.stringify(req.body.username));
              res.end("Successful Login");
              console.log(JSON.stringify(res.cookie));
            } else {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("Invalid Credentials");
            }
          });
        } else {
          console.log("400");
          res.status(400).send({ message: "Invalid Credentials !" });
        }
      }
    });
  });
});
*/

//Route to get All Books when user visits the Home Page
app.get("/home", function(req, res) {
  var sql = "SELECT * FROM homeaway.user_details";
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving Book Details");
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
      console.log("JSON.stringify(result)", JSON.stringify(result));
    }
  });
});
/*
app.post("/myProfile/:id", function(req, res) {
  console.log("req.session.user", JSON.stringify(req.params.id));
  var sql =
    "select * FROM homeaway.user_details where username= " +
    mysql.escape(req.params.id);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving Book Details");
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
      console.log(JSON.stringify(result));
      console.log("JSON.stringify(result)", JSON.stringify(result));
    }
  });
});

*/

// app.get("/myProfile/:id", function(req, res) {
//   console.log("req.session.user", JSON.stringify(req.params.id));
//   var sql =
//     "select * FROM homeaway.user_details where username= " +
//     mysql.escape(req.params.id);
//   kafka.make_request(
//     "get_user_detail_topic",
//     { username: req.params.id },
//     function(err, result) {
//       if (err) {
//         res.writeHead(400, {
//           "Content-Type": "text/plain"
//         });
//         res.end("Error while retrieving Book Details");
//       } else {
//         res.writeHead(200, {
//           "Content-Type": "application/json"
//         });
//         res.end(JSON.stringify(result));
//         console.log(JSON.stringify(result));
//         console.log("JSON.stringify(result)", JSON.stringify(result));
//       }
//     }
//   );
// });

app.post("/create", function(req, res) {
  console.log("Inside Create Request Handler");
  var sql =
    "insert into  bookapp.bookDetails (book_name,author) values ( " +
    // mysql.escape(req.body.book_id) +
    // " , " +
    mysql.escape(req.body.book_name) +
    " , " +
    mysql.escape(req.body.author) +
    " ) ";
  console.log("sql", sql);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error While Creating Book");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("Book Created Successfully");
    }
  });
});

var storagePropFiles = multer.diskStorage({
  destination: function(req, file, callback) {
    console.log("req.session.user is", JSON.stringify(req.params));
    callback(null, createDirectory(prop_id));
  },
  filename: function(req, file, callback) {
    console.log("req", req.body);
    callback(null, file.originalname);
  }
});

var rootDirectory = "public/images/";

var uploadPropFiles = multer({
  storage: storagePropFiles
});

function createDirectory(prop_id) {
  if (!fs.existsSync(rootDirectory)) {
    fs.mkdirSync(rootDirectory);
  }
  let directory = rootDirectory + prop_id;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return directory;
}

app.post("/upload-files/", uploadPropFiles.any(), function(req, res, next) {
  console.log("###/saveProfile");
  console.log("max prop id", prop_id);
  console.log(JSON.stringify(req.body));
  console.log(req.body);
  if (true) {
    console.log(req.body, "Body");
    // console.log(req.files, 'files');
    res.status(200).send({ result: "File is uploaded" });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});
/*
app.get("/getPropid", function(req, res) {
  console.log("max prop id", req.body);

  // check user already exists
  kafka.make_request("get_propertyid_topic", {}, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in getting property id.");
    } else {
      console.log("result for prop_id", result);
      prop_id = result.value + 1;
      console.log("max prop_id is", prop_id);
    }
    const data = { prop_id: result.value };
    res.end(JSON.stringify(data));
  });
});
*/

app.get("/getPropid", function(req, res) {
  var results = {};
  console.log("In get MAX PROp ID request:");

  var pipeline = [
    { $unwind: "$properties" },
    {
      $sort: {
        "properties.prop_id": -1
      }
    },
    { $limit: 1 }
  ];
  var promise = HomeAway.aggregate(pipeline).exec();
  promise
    .then(function(data) {
      console.log("max property id query");
      console.log(data[0].properties.prop_id);
      results.value = data[0].properties.prop_id;
      if (data) {
        prop_id = data[0].properties.prop_id + 1;
        results.code = 200;
        // callback(null, res);
        res.status(200).send(results);
      }
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      res.code = "400";
      //callback(err, res);
      res.status(400).send(results);
    });
});
app.post("/list-property", function(req, res) {
  var results = {};
  console.log("list property params", req.body);
  var pipeline = [
    { $unwind: "$properties" },
    {
      $sort: {
        "properties.prop_id": -1
      }
    },
    { $limit: 1 }
  ];
  var promise = HomeAway.aggregate(pipeline).exec();

  promise
    .then(function(data) {
      console.log("list property data-");
      console.log(data[0].properties.prop_id);
      res.value = data;
      //});
      if (data) {
        var myObj = {
          prop_id: data[0].properties.prop_id + 1,
          headline: req.body.propDetails.headline,
          type: req.body.propDetails.type,
          city: req.body.propDetails.city,
          bed: req.body.propDetails.Bed,
          bath: req.body.propDetails.Bath,
          startdate: req.body.fromDate,
          enddate: req.body.toDate,
          currencytype: req.body.propDetails.currency,
          rate: req.body.propDetails.rate,
          minstay: req.body.propDetails.minstay,
          // maxadults: msg.property.propDetails.maxadults,
          // maxchild: msg.property.propDetails.maxchild,
          //   availability: msg.property.property.availability,
          description: req.body.propDetails.desc,
          unit: req.body.propDetails.unit,
          // city: msg.property.property.city,
          //  state: msg.property.property.state,
          zip: req.body.propDetails.zip,
          country: req.body.propDetails.country,
          address: req.body.propDetails.address
        };
        console.log("myobj", myObj);
        HomeAway.findOneAndUpdate(
          { "user.username": req.body.userid },
          { $push: { properties: myObj } },
          function(err, doc) {
            if (err) {
              res.code = "400";
              res.value = "Cannot post property at the moment";
              console.log(results.value);
              res
                .status(400)
                .send({ message: "Cannot post property at the moment" });
              // callback(err, res);
            } else {
              res.code = "200";
              res.value = doc;
              console.log(doc);
              res.status(200).send({ message: "property listed successfully" });
              // callback(null, res);
            }
          }
        );
      }
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      res.code = "400";
      callback(err, res);
    });
});
/*
app.post("/list-property", function(req, res) {
  console.log(req.body);

  // check user already exists
  if (true) {
    var currentprop_id = null;

    let selectQuery = "SELECT max(prop_id) as prop_id from homeaway.property;";
    con.query(selectQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        console.log("result for prop_id", result[0].prop_id);
        currentprop_id = result[0].prop_id + 1;
        var startDate = "2018-09-23";
        var endDate = "2014-06-22";
        let insertQuery =
          "INSERT INTO homeaway.property (`prop_id`, `bed`, `bath`, `country`, `address`, `unit`, `city`, `state`,`zip`,`headline`,`description`,`houseType`,`capacity`,`currency`,`rate`,`minStay`,`fromDate`,`toDate`) VALUES ('" +
          currentprop_id +
          "', '" +
          req.body.bed +
          "', '" +
          req.body.bath +
          "', '" +
          req.body.propDetails.country +
          "', '" +
          req.body.propDetails.address +
          "', '" +
          req.body.propDetails.unit +
          "', '" +
          req.body.propDetails.city +
          "', '" +
          req.body.propDetails.state1 +
          "', '" +
          req.body.propDetails.zip +
          "', '" +
          req.body.propDetails.headline +
          "', '" +
          req.body.propDetails.desc +
          "', '" +
          req.body.propDetails.type +
          "', '" +
          req.body.propDetails.capacity +
          "', '" +
          req.body.propDetails.currency +
          "', '" +
          req.body.propDetails.rate +
          "', '" +
          req.body.propDetails.minstay +
          "', '" +
          req.body.fromDate +
          "', '" +
          req.body.toDate +
          "')";
        con.query(insertQuery, function(err, result) {
          if (err) {
            console.log("insert", insertQuery);
            res.writeHead(400, {
              "Content-Type": "text/plain"
            });
            res.end("Error in Posting property.");
          } else {
            console.log("property inserted in property table");
            let insertPropListQuery =
              "INSERT INTO homeaway.ownerListings(`user_id`,`prop_id`,`fromDate`,`toDate`) VALUES ('" +
              req.body.userid +
              "', '" +
              currentprop_id +
              "', '" +
              req.body.fromDate +
              "', '" +
              req.body.toDate +
              "')";

            con.query(insertPropListQuery, function(err, result) {
              if (err) {
                console.log(insertPropListQuery);
                res.writeHead(400, {
                  "Content-Type": "text/plain"
                });
                res.end("Error in Posting property.");
              } else {
                res
                  .status(200)
                  .send({ message: "property Listed successfully!" });
              }
            });
            //  res.status(200).send({ message: "property Listed successfully!" });
          }
        });
      }
    });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});
*/

// app.post("/list-property", function(req, res) {
//   console.log(req.body);

//   // check user already exists
//   if (true) {
//     var currentprop_id = null;

//     //let selectQuery = "SELECT max(prop_id) as prop_id from homeaway.property;";
//     kafka.make_request("list_property_topic", { property: req.body }, function(
//       err,
//       result
//     ) {
//       if (err) {
//         res.writeHead(400, {
//           "Content-Type": "text/plain"
//         });
//         res.end("Error in Posting property.");
//       } else {
//         console.log("result for prop_id", result[0].prop_id);
//         currentprop_id = result[0].prop_id + 1;

//         con.query(insertQuery, function(err, result) {
//           if (err) {
//             console.log("insert", insertQuery);
//             res.writeHead(400, {
//               "Content-Type": "text/plain"
//             });
//             res.end("Error in Posting property.");
//           } else {
//             console.log("property inserted in property table");
//             let insertPropListQuery =
//               "INSERT INTO homeaway.ownerListings(`user_id`,`prop_id`,`fromDate`,`toDate`) VALUES ('" +
//               req.body.userid +
//               "', '" +
//               currentprop_id +
//               "', '" +
//               req.body.fromDate +
//               "', '" +
//               req.body.toDate +
//               "')";

//             con.query(insertPropListQuery, function(err, result) {
//               if (err) {
//                 console.log(insertPropListQuery);
//                 res.writeHead(400, {
//                   "Content-Type": "text/plain"
//                 });
//                 res.end("Error in Posting property.");
//               } else {
//                 res
//                   .status(200)
//                   .send({ message: "property Listed successfully!" });
//               }
//             });
//             //  res.status(200).send({ message: "property Listed successfully!" });
//           }
//         });
//       }
//     });
//   } else {
//     res.statusMessage = "invalid session";
//     res.status(401).end();
//   }
// });

app.post("/getPropertyImg", function(req, res, next) {
  console.log("image body", req.body);
  console.log("req.session.username for image", req.session.username);
  var filter = ".png";
  var results = [];
  var startPath =
    "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
    req.body.id;
  if (req.body.id) {
    var files = fs.readdirSync(startPath);
    console.log("files", files);

    console.log(files.length);

    fs.readFile(
      "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
        req.body.id +
        "/" +
        files[0],
      function(err, content) {
        console.log("###img:", content);
        console.log("###filename:", files[0]);
        if (err) {
          res.writeHead(400, { "Content-type": "text/html" });
          console.log(err);
          res.end("No such image");
        } else {
          //specify the content type in the response will be an image
          let base64Image = new Buffer(content, "binary").toString("base64");
          //  results.push(base64Image);
          console.log("###image in node");
          // console.log(base64Image);
          //console.log("results", base64Image);
          //res.status(200).send({ img: results });
          //convert image file to base64-encoded string
          res.status(200).send({ propid: req.body.id, img: base64Image });
          // res.end({img : base64Image});
        }
      }
    );

    //  console.log("result length", results);
    //  res.status(200).send({ img: results });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

app.post("/getSelectedPropertyImg", function(req, res, next) {
  console.log("image body for selected img", req.body);
  console.log("req.session.username for image", req.session.username);
  var filter = ".png";

  var startPath =
    "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
    req.body.id;
  if (req.body.id) {
    var results = [];
    var files = fs.readdirSync(startPath);
    console.log("files", files);

    console.log(files.length);
    downloadFiles = () => {
      files.forEach(async function(file) {
        console.log("files in download", file);
        fs.readFile(
          "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
            req.body.id +
            "/" +
            file,
          await function(err, content) {
            console.log("###img:", content);
            console.log("###filename:", file);
            if (err) {
              res.writeHead(400, { "Content-type": "text/html" });
              console.log(err);
              res.end("No such image");
            } else {
              //specify the content type in the response will be an image
              let base64Image = new Buffer(content, "binary").toString(
                "base64"
              );
              results.push(base64Image);
              console.log("###image in node", results.length);
              // console.log(base64Image);
              //console.log("results", base64Image);
              console.log("results in download", results.length);
              if (results.length === files.length) {
                console.log("final result", results.length);
                res.status(200).send({ results });
              }
              //res.status(200).send({ img: results });
              //convert image file to base64-encoded string
              //res.status(200).send({ propid: req.body.id, img: base64Image });
              // res.end({img : base64Image});
            }
          }
        );
      });

      return results;
    };

    let photos = [];
    photos = downloadFiles(function(result) {
      console.log("final result", result);
    });
    console.log("phpto", photos);

    // res.status(200).send({ img: results });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});
app.get("/myProfile/:id", function(req, res) {
  var results = {};
  console.log(
    "In get user details handle request:",
    JSON.stringify(req.params.id)
  );
  HomeAway.findOne(
    { "user.username": req.params.id },
    { user: 1, _id: 0 },
    function(err, user) {
      if (user) {
        results.code = "200";
        results.value = user;
        console.log(user);
        console.log(results.value);
        res.status(200).send(results);
      } else {
        results.code = "400";
        results.value = "Could not find User";
        console.log(res.value);
        res.status(400).send(results);
      }
    }
  );
});
// app.post("/editprofile/save", function(req, res) {
//   var startDate = "2018-09-23";
//   var endDate = "2014-06-22";
//   console.log("edit priofile", JSON.stringify(req.body));

//   let updateQuery =
//     "UPDATE homeaway.user_details SET aboutMe =" +
//     '"' +
//     req.body.About +
//     '"' +
//     "," +
//     "company =" +
//     '"' +
//     req.body.Company +
//     '"' +
//     "," +
//     "school =" +
//     '"' +
//     req.body.School +
//     '"' +
//     "," +
//     "hometown =" +
//     '"' +
//     req.body.Hometown +
//     '"' +
//     "," +
//     "languages =" +
//     '"' +
//     req.body.Languages +
//     '"' +
//     "," +
//     "gender =" +
//     '"' +
//     req.body.Gender +
//     '"' +
//     "," +
//     "city =" +
//     '"' +
//     req.body.City +
//     '"' +
//     " WHERE username=" +
//     '"' +
//     req.body.userId +
//     '"' +
//     ";";
//   console.log("QUERY IS " + updateQuery);

//   con.query(updateQuery, function(err, result) {
//     if (err) {
//       console.log("insert", updateQuery);
//       res.writeHead(400, {
//         "Content-Type": "text/plain"
//       });
//       res.end("Error in Updating profile.");
//     } else {
//       res.status(200).send({ message: "profile updated successfully!" });
//     }
//   });
// });

// app.post("/book-property", function(req, res) {
//   console.log(req.body);
//   var startDate = "2018-09-23";
//   var endDate = "2014-06-22";
//   // check user already exists
//   if (true) {
//     let insertQuery =
//       "INSERT INTO homeaway.travellerBookings (`user_id`, `prop_id`, `fromDate`, `toDate`) VALUES ('" +
//       req.body.userId +
//       "', '" +
//       req.body.prop_id +
//       "', '" +
//       req.body.fromDate +
//       "', '" +
//       req.body.toDate +
//       "')";

//     con.query(insertQuery, function(err, result) {
//       if (err) {
//         res.writeHead(400, {
//           "Content-Type": "text/plain"
//         });
//         res.end("Error in Booking property.");
//       } else {
//         res.status(200).send({ message: "property booked successfully!" });
//       }
//     });
//   } else {
//     res.statusMessage = "invalid session";
//     res.status(401).end();
//   }
// });

// app.post("/places", function(req, res) {
//   console.log("places request are ", req.body);
//   // let selectQuery = "SELECT * from homeaway.property;";
//   let selectQuery =
//     "SELECT * from homeaway.property where city like '%" +
//     req.body.location +
//     "%' " +
//     " and adults >= " +
//     req.body.adults +
//     " and children >= " +
//     req.body.kids +
//     " and prop_id not in ( select distinct(prop_id) from HomeAway.TravellerBookings where " +
//     '"' +
//     req.body.fromDate +
//     '"' +
//     " between  fromDate and toDate || " +
//     '"' +
//     req.body.toDate +
//     '"' +
//     " between fromDate and toDate || fromDate between" +
//     '"' +
//     req.body.fromDate +
//     '"' +
//     "and" +
//     '"' +
//     req.body.toDate +
//     '"' +
//     "|| toDate between" +
//     '"' +
//     req.body.fromDate +
//     '"' +
//     "and" +
//     '"' +
//     req.body.toDate +
//     '"' +
//     ")" +
//     "and " +
//     '"' +
//     req.body.fromDate +
//     '"' +
//     " between  fromDate and toDate and  " +
//     '"' +
//     req.body.toDate +
//     '"' +
//     " between fromDate and toDate" +
//     " ;";

//   // "SELECT *  FROM homeaway.property WHERE city  like '%" +
//   //   req.body.location +
//   //   "%'";

//   console.log(selectQuery);
//   con.query(selectQuery, function(err, result) {
//     if (err) {
//       res.writeHead(400, {
//         "Content-Type": "text/plain"
//       });
//       res.end("Error in Posting property.");
//     } else {
//       res.status(200).send(JSON.stringify(result));
//     }
//   });
// });

// app.get("/places/getListings/:id", function(req, res) {
//   let selectQuery =
//     "SELECT * from homeaway.property where prop_id=" +
//     mysql.escape(req.params.id);
//   console.log("selectQuery is", selectQuery);
//   con.query(selectQuery, function(err, result) {
//     if (err) {
//       res.writeHead(400, {
//         "Content-Type": "text/plain"
//       });
//       res.end("Error in Posting property.");
//     } else {
//       res.status(200).send(JSON.stringify(result));
//     }
//   });
// });

app.get("/places/latestbookings/:id", function(req, res) {
  var results = {};
  var pipeline = [
    // Initial document match (uses index, if a suitable one is available)
    {
      $match: {
        "user.username": {
          $eq: req.params.id
        }
      }
    },
    {
      $project: {
        bookings: "$bookings",
        _id: 0
      }
    },

    // Expand the scores array into a stream of documents
    { $unwind: "$bookings" }
  ];
  var promise = HomeAway.aggregate(pipeline).exec();
  promise
    .then(function(data) {
      console.log("traveler tripboards data-");
      console.log(data);
      results.value = data;
      if (data) {
        results.code = 200;
      }
      res.status(200).send(results);
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      results.code = "400";
      res.status(400).send(results);
    });
});

app.get("/properties/latestlistings/:id", function(req, res) {
  var results = {};
  console.log("In Owner Dashboard handle request:", req.params.id);

  var pipeline = [
    // Initial document match (uses index, if a suitable one is available)
    {
      $match: {
        "user.username": {
          $eq: req.params.id
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
      results.value = data;
      if (data) {
        results.code = 200;
        // callback(null, res);
        res.status(200).send(results);
      }
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      results.code = "400";
      res.status(400).send(results);
    });
});

// app.get("/places/getselectedproperty/:id", function(req, res) {

// })
// app.get("/properties/latestlistings/:id", function(req, res) {
//   let selectQuery =
//     "SELECT  prop_id from homeaway.ownerListings where user_id=" +
//     mysql.escape(req.params.id) +
//     " order by fromDate desc LIMIT 2";
//   console.log("Owner Dashboard query", selectQuery);
//   con.query(selectQuery, function(err, result) {
//     if (err) {
//       res.writeHead(400, {
//         "Content-Type": "text/plain"
//       });
//       console.log(selectQuery);
//       res.end("Error in Posting property.");
//     } else {
//       if (result.length > 0) {
//         var propid = [];
//         console.log(result);

//         if (result.length < 2) {
//           prop_id = [result[0].prop_id, null];
//         } else {
//           prop_id = [result[0].prop_id, result[1].prop_id];
//         }

//         console.log("propid for listings", propid);

//         let selectQuery =
//           "SELECT  * from homeaway.property where prop_id in (" +
//           prop_id[0] +
//           "," +
//           prop_id[1] +
//           ")";
//         con.query(selectQuery, function(err, result) {
//           if (err) {
//             console.log(selectQuery);
//             res.writeHead(400, {
//               "Content-Type": "text/plain"
//             });
//             res.end("Error in Posting property.");
//           } else {
//             res.status(200).send(JSON.stringify(result));
//           }
//         });
//       } else {
//         res.status(400).send({ message: "No Listings Found !" });
//       }
//     }
//   });
// });
app.post("/traveller/signup", function(req, res) {
  var results = {};
  console.log("In traveler signup handle request:", JSON.stringify(req.body));

  console.log("signup message", req);
  bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
    hashed_password = hash;

    var myobj = new HomeAway({
      user: {
        username: req.body.Email,
        password: hashed_password,
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        isTraveler: true
      }
    });

    var promise = myobj.save();

    promise
      .then(function() {
        results.value = req.body;
        results.code = 200;
        const body = { _id: req.body.Email, type: "traveler" };
        const token = jwt.sign({ user: body }, "verified_homeawayUser");
        res.status(200).send(token);
        //  callback(null, res);
      })

      .catch(function(err) {
        console.log("error:", err.message);
        if (err.message.includes("username_1 dup key:"))
          results.value = "This username already exists!";
        else results.value = "Error in registering data please try again!";

        results.code = "400";
        res.status(400).send(results);
        // callback(null, res);
      });
  });
});

app.post("/owner/signup", function(req, res) {
  var results = {};
  console.log("In owner signup handle request:", JSON.stringify(req.body));

  console.log("signup message", req);
  bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
    hashed_password = hash;

    var myobj = new HomeAway({
      user: {
        username: req.body.Email,
        password: hashed_password,
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        isOwner: true
      }
    });

    var promise = myobj.save();

    promise
      .then(function() {
        results.value = req.body;
        results.code = 200;
        const body = { _id: req.body.Email, type: "owner" };
        const token = jwt.sign({ user: body }, "verified_homeawayUser");
        res.status(200).send(token);
        //  callback(null, res);
      })

      .catch(function(err) {
        console.log("error:", err.message);
        if (err.message.includes("username_1 dup key:"))
          results.value = "This username already exists!";
        else results.value = "Error in registering data please try again!";

        results.code = "400";
        res.status(400).send(results);
        // callback(null, res);
      });
  });
});
// app.post("/traveller/signup", function(req, res) {
//   console.log("Inside Traveller signup Request Handler");
//   console.log(req.body);
//   con.getConnection(function(err) {
//     if (err) {
//       throw err;
//     }
//     var hashed_password = "";
//     bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
//       hashed_password = hash;
//       var username = req.body.Email;
//       var firstname = req.body.Fname;
//       var lastname = req.body.Lname;
//       var insertNewUser =
//         "insert into  homeaway.user_details (username,password,Fname,Lname,isTraveller) values ( " +
//         // mysql.escape(req.body.book_id) +
//         // " , " +
//         mysql.escape(username) +
//         " , " +
//         mysql.escape(hashed_password) +
//         " , " +
//         mysql.escape(firstname) +
//         " , " +
//         mysql.escape(lastname) +
//         " , " +
//         `1` +
//         " ) ";
//       console.log("insertNewUser", insertNewUser);
//       con.query(insertNewUser, function(err, result) {
//         //err.sqlMessage.includes("for key 'PRIMARY''"
//         if (err) {
//           res.writeHead(400, {
//             "Content-Type": "text/plain"
//           });
//           res.end("User name already exists");
//         } else {
//           var sql =
//             "SELECT *  FROM homeaway.user_details WHERE username = " +
//             mysql.escape(req.body.Email) +
//             "and password = " +
//             mysql.escape(hashed_password);

//           con.query(sql, function(err, result) {
//             if (err) {
//               console.log("Select is", sql);
//               res.writeHead(400, {
//                 "Content-Type": "text/plain"
//               });
//               res.end("Invalid Credentials");
//             } else {
//               res.cookie("cookie", "cookie", {
//                 maxAge: 900000,
//                 httpOnly: false,
//                 path: "/"
//               });
//               console.log("cookie", res.cookie);
//               req.session.user = result[0];
//               console.log("result", result);
//               console.log("req.session.user", req.session.user);
//               // res.writeHead(200, {
//               //   "Content-Type": "text/plain"
//               // });
//               res.status(200).send({ message: "User Added successfully!" });
//               // console.log("result login", result);
//             }
//           });
//         }
//       });
//     });
//   });
// });

// app.post("/traveller/signup", function(req, res) {
//   console.log("Inside Traveller signup Request Handler");
//   console.log(req.body);
//   MongoClient.connect(
//     url,
//     function(err, client) {
//       if (err) {
//         throw err;
//       } else {
//         const db = client.db(dbname);
//         console.log("traveller signup connection");
//         var hashed_password = "";
//         bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
//           hashed_password = hash;
//           var username = req.body.Email;
//           var firstname = req.body.Fname;
//           var lastname = req.body.Lname;

//           var travelerdetails = {
//             username: username,
//             password: hashed_password,
//             Fname: firstname,
//             Lname: lastname,
//             isTraveler: "1"
//           };

//           db.collection("HomeAway").insertOne(travelerdetails, function(
//             err,
//             result
//           ) {
//             //err.sqlMessage.includes("for key 'PRIMARY''"
//             if (err) {
//               res.writeHead(400, {
//                 "Content-Type": "text/plain"
//               });
//               res.end("User name already exists");
//               client.close();
//             } else {
//               console.log("traveler inserted");
//               res.cookie("cookie", req.body.username, {
//                 maxAge: 900000,
//                 httpOnly: false,
//                 path: "/"
//               });
//               req.session.user = result;

//               req.session.user = result;
//               res.status(200).send({ message: "User Added successfully!" });
//             }
//           });
//         });
//       }
//     }
//   );
// });
/*
app.post("/owner/signup", function(req, res) {
  console.log("Inside Owner signup Request Handler");
  console.log(req.body);
  MongoClient.connect(
    url,
    function(err, client) {
      if (err) {
        throw err;
      } else {
        const db = client.db(dbname);
        console.log("owner signup connection");
        var hashed_password = "";
        bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
          hashed_password = hash;
          var username = req.body.Email;
          var firstname = req.body.Fname;
          var lastname = req.body.Lname;

          var ownerDetails = {
            username: username,
            password: hashed_password,
            Fname: firstname,
            Lname: lastname,
            isOwner: "1"
          };

          db.collection("HomeAway").insertOne(ownerDetails, function(
            err,
            result
          ) {
            //err.sqlMessage.includes("for key 'PRIMARY''"
            if (err) {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("User name already exists");
              client.close();
            } else {
              console.log("owner inserted");
              res.cookie("cookieOwner", username, {
                maxAge: 9000000,
                httpOnly: false,
                path: "/"
              });
              req.session.user = result;
              //console.log("cookie is" + cookie);

              req.session.user = result;
              res.status(200).send({ message: "Owner Added successfully!" });
            }
          });
        });
      }
    }
  );
});*/

// function calculateDate(fromDate, toDate) {
//   let startdateYEARextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + fromDate + '"' + ",'%Y');";
//   let enddateYEARextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + toDate + '"' + ",'%Y');";
//   let startdateMONTHextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + fromDate + '"' + ",'%m');";
//   let enddateMONTHextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + toDate + '"' + ",'%m');";
//   let startdateDAYextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + fromDate + '"' + ",'%d');";
//   let enddateDAYextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + toDate + '"' + ",'%d');";

//   con.query(startdateYEARextractSQL, function(err, result) {
//     for (var key in result) {
//       var startdateYEARextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("STARTYEAR IS " + startdateYEARextractSQL);
//     }
//   });
//   con.query(startdateMONTHextractSQL, function(err, result) {
//     for (var key in result) {
//       var startdateMONTHextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("STARTMONTH IS " + startdateMONTHextractSQL);
//     }
//   });
//   con.query(startdateDAYextractSQL, function(err, result) {
//     for (var key in result) {
//       var startdateDAYextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("STARTDAY IS " + startdateDAYextractSQL);
//     }
//   });

//   con.query(enddateYEARextractSQL, function(err, result) {
//     for (var key in result) {
//       var enddateYEARextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("ENDYEAR IS " + enddateYEARextractSQL);
//     }
//   });

//   con.query(enddateMONTHextractSQL, function(err, result) {
//     for (var key in result) {
//       var enddateMONTHextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("ENDMONTH IS " + enddateMONTHextractSQL);
//     }
//   });

//   con.query(enddateDAYextractSQL, function(err, result) {
//     for (var key in result) {
//       var enddateDAYextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("ENDDAY IS " + enddateDAYextractSQL);
//     }
//   });

//   var resultfromDate =
//     startdateMONTHextractSQL + startdateDAYextractSQL + startdateYEARextractSQL;
//   var resulttoDate =
//     enddateMONTHextractSQL + enddateDAYextractSQL + enddateYEARextractSQL;
// }

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);
app.listen(8080, () => {
  console.log("GraphQL server started on port 8080");
});
