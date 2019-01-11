// var kafka = require("../kafka/client");

// exports.login = function(req, res) {
//   console.log("Inside Login Post Request");
//   console.log("reqis", req.body.username);
//   kafka.make_request(
//     "traveler_login_topic",
//     { username: req.body.username, password: req.body.password },
//     function(err, result) {
//       console.log("in result");
//       //  console.log(results);
//       if (err) {
//         res.writeHead(400, {
//           "Content-Type": "text/plain"
//         });
//         res.end("Invalid Credentials");
//       } else {
//         res.cookie("cookie", req.body.username, {
//           maxAge: 900000,
//           httpOnly: false,
//           path: "/"
//         });
//         console.log("Successfully retrieving");
//         res.status(200).send(JSON.stringify(req.body.username));
//       }
//     }
//   );
// };
const jwt = require("jsonwebtoken");
var kafka = require("../kafka/client");
var jwtDecode = require("jwt-decode");

exports.login = function(req, res) {
  console.log("Connected!");
  console.log("Inside traveler Login Post Request");

  kafka.make_request(
    "login_traveler_topic",
    { username: req.body.username, password: req.body.password },

    function(err, result) {
      console.log("req.body.username", req.body.username);
      console.log("req.body.password", req.body.password);

      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        const body = { _id: req.body.username, type: "traveler" };
        const token = jwt.sign({ user: body }, "verified_homeawayUser");
        res.cookie("cookie", req.body.username, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = result;
        var decoded = jwtDecode(token);
        var tid = decoded.user.type;
        console.log("Successfully retrieving traveler login", tid);
        console.log("req.body.username", JSON.stringify(req.body.username));

        res.status(200).send(token);
        // res.end("Successful Login");
        // console.log("result0", result);
      } //else
    }
  );
};
