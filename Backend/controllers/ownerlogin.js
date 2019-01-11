const jwt = require("jsonwebtoken");
var kafka = require("../kafka/client");
var jwtDecode = require("jwt-decode");

exports.ownerlogin = function(req, res) {
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
        const body = { _id: req.body.username, type: "owner" };
        const token = jwt.sign({ user: body }, "verified_homeawayUser");
        res.cookie("cookieOwner", req.body.username, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = result;
        var decoded = jwtDecode(token);
        var tid = decoded.user.type;
        console.log("Successfully retrieving owner login", tid);

        console.log("req.body.username", JSON.stringify(req.body.username));

        res.status(200).send(token);
        // res.end("Successful Login");
        // console.log("result0", result);
      } //else
    }
  );
};
