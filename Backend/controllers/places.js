var kafka = require("../kafka/client");
// export const places = {
//   getplaces
// };

exports.getplaces = function(req, res) {
  console.log("places request are ", req.body);
  kafka.make_request("get_places_topic", { searchplaces: req.body }, function(
    err,
    result
  ) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in fetching places.");
    } else {
      res.status(200).send(JSON.stringify(result));
    }
  });
};
