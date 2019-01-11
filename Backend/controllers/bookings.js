var kafka = require("../kafka/client");

// export const travelerdetails = {
//   getlatestbookings,
//   bookproperty
// };
exports.getlatestbookings = function(req, res) {
  kafka.make_request(
    "get_traveler_tripboards_topic",
    { username: req.params.id },
    function(err, results) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        console.log(selectQuery);
        res.end("Error in getting details.");
      } else {
        if (results.code == 200) {
          console.log(
            "Successfully retrieving latest bookings: " + results.value
          );
          res.status(201).json({ output: 1 });
        } else {
          res.status(201).json({ output: 0 });
        }
      }
    }
  );
};

exports.bookproperty = function(req, res) {
  console.log(req.body);

  kafka.make_request("bookproperty_topic", { property: req.body }, function(
    err,
    results
  ) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in Booking property.");
    } else {
      if (results.code == 200) {
        console.log("Successfully booking property : ", results.value);
        //res.status(200).send({ message: "property booked successfully!" });
        res.status(201).json({ output: 1 });
      } else {
        res.status(201).json({ output: 0 });
      }
    }
  });
};

exports.askaquestion = function(req, res) {
  console.log(req.body);

  kafka.make_request("ask_question_topic", { messages: req.body }, function(
    err,
    results
  ) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in posting question.");
    } else {
      if (results.code == 200) {
        console.log("Successfully posted the question : ", results.value);
        //res.status(200).send({ message: "property booked successfully!" });
        res.status(201).json({ output: 1 });
      } else {
        res.status(201).json({ output: 0 });
      }
    }
  });
};

exports.getquestions = function(req, res) {
  console.log(req.body);

  kafka.make_request("get_questions_topic", { messages: req.body }, function(
    err,
    results
  ) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in posting question.");
    } else {
      if (results.code == 200) {
        console.log("Successfully retrieved the question : ", results.value);
        res.status(200).send({ message: results.value });
        // res.status(201).json({ output: results.value });
      } else {
        res.status(201).json({ output: 0 });
      }
    }
  });
};

exports.gettravelerquestions = function(req, res) {
  console.log(req.body);

  kafka.make_request(
    "get_traveler_questions_topic",
    { messages: req.body },
    function(err, results) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in posting question.");
      } else {
        if (results.code == 200) {
          console.log("Successfully retrieved the question : ", results.value);
          res.status(200).send({ message: results.value });
          // res.status(201).json({ output: results.value });
        } else {
          res.status(201).json({ output: 0 });
        }
      }
    }
  );
};

exports.getselectedpropertydetail = function(req, res) {
  console.log("selected property detail", req.params.id);

  kafka.make_request(
    "get_selected_property_topic",
    { username: req.params.id },
    function(err, results) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in getting property.");
      } else {
        if (results.code == 200) {
          console.log(
            "Successfully retreived the property details : ",
            results.value
          );
          res.status(200).send({ message: results.value });
          // res.status(201).json({ output: results.value });
        } else {
          res.status(201).json({ output: 0 });
        }
      }
    }
  );
};
