var kafka = require("../kafka/client");

// export const myprofile = {
//   getmyprofile,
//   updateprofile
// };
exports.getmyprofile = function(req, res) {
  console.log("req.session.user", JSON.stringify(req.params.id));
  kafka.make_request(
    "user_profile_topic",
    { username: req.params.id },
    function(err, result) {
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
    }
  );
};

exports.updateprofile = function(req, res) {
  console.log("edit priofile", JSON.stringify(req.body));

  kafka.make_request("edit_profile_topic", { profile: req.body }, function(
    err,
    results
  ) {
    if (err) {
      // console.log("insert", updateQuery);
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in Updating profile.");
    } else {
      res.status(200).send({ message: "profile updated successfully!" });
    }
  });
};
