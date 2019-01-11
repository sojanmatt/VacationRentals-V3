var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var kafka = require("../kafka/client");

module.exports = passport.use(
  "login",
  new LocalStrategy(function(username, password, done) {
    console.log("in password");
    kafka.make_request(
      "traveler_login_topic",
      { username: username, password: password },
      function(err, results) {
        if (err) {
          console.log("err is", err);
          done(err, {});
        } else {
          console.log("in result", results);
          if (results.code == 200) {
            console.log("result code", results.code);
            return done(null, {
              username: username,
              password: password
              //  name: results.value.name,
              //   email: results.value.email
            });
          } else {
            console.log("else done", done);
            done(null, false);
          }
        }
        //  console.log(results);
        //   if (err) {
        //     res.writeHead(400, {
        //       "Content-Type": "text/plain"
        //     });
        //     res.end("Invalid Credentials");
        //   } else {
        //     res.cookie("cookie", req.body.username, {
        //       maxAge: 900000,
        //       httpOnly: false,
        //       path: "/"
        //     });
        //     console.log("Successfully retrieving");
        //     res.status(200).send(JSON.stringify(req.body.username));
        //   }
      }
    );
  })
);

module.exports = passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, username, password, done) {
      console.log("Inside Signup");

      //setting queue name and payload
      kafka.make_request(
        "signup_topic",
        {
          username: username,
          password: password,
          name: req.body.Name,
          email: req.body.Email,
          looking_for: req.body.looking_for
        },
        function(err, results) {
          console.log("in result");
          console.log(results);
          if (err) {
            done(err, {});
          } else {
            if (results.code == 200) {
              done(null, true, results);
            } else {
              done(null, false, results);
            }
          }
        }
      );
    }
  )
);
