var kafka = require("../kafka/client");

// export const property = {
//   listproperty,
//   getpropertyimage,
//   getselectedpropertyimage,
//   getlistings,
//   getlatestlistings,
//   getpropertyid
// };

exports.listproperty = function(req, res) {
  console.log(req.body);

  // check user already exists

  var currentprop_id = null;

  //let selectQuery = "SELECT max(prop_id) as prop_id from homeaway.property;";
  kafka.make_request("post_property_topic", { property: req.body }, function(
    err,
    result
  ) {
    console.log("in post-property_topic");
    console.log(req.body);
    if (err) {
      console.log("err", err);
      res.status(500).send({ message: "Server Error!" });
    } else {
      console.log("Listing Successful!");
      res.status(200).send({ message: "Property Listed successfully!" });
    }
  });
};

exports.getpropertyimage = function(req, res, next) {
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
};

exports.getselectedpropertyimage = function(req, res, next) {
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
};

exports.getlistings = function(req, res) {
  console.log("Inside get listings topic ");
  kafka.make_request(
    "get_owner_listings_topic",
    {
      username: req.params.id
    },
    function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in getting property.");
      } else {
        res.status(200).send(JSON.stringify(result));
      }
    }
  );
};

exports.getlatestlistings = function(req, res) {
  console.log("Owner latest listings Dashboard query");
  kafka.make_request(
    "get_owner_listings_topic",
    { username: req.params.id },
    function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        console.log(selectQuery);
        res.end("Error in fetching listings.");
      } else {
        res.status(200).send(JSON.stringify(result));
      }
    }
  );
};

exports.getpropertyid = function(req, res) {
  console.log("max prop id");

  // check user already exists
  kafka.make_request("get_propertyid_topic", {}, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in getting property id.");
    } else {
      console.log("result for prop_id", result);
      // prop_id = result[0].prop_id + 1;
    }
    const data = { prop_id: result.value };
    res.end(JSON.stringify(data));
  });
};
