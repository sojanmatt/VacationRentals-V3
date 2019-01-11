const express = require("express");

const router = express.Router();

//Lets say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user

app.post("/myProfile/:id", function(req, res) {
  console.log("req.session.user", JSON.stringify(req.params.id));
  kafka.make_request("getprofile_topic", { username: req.params.id }, function(
    err,
    result
  ) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving profile Details");
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

module.exports = router;
