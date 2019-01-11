app.post("/list-property", function(req, res) {
  console.log(req.body);
  // check user already exists
  if (req.session.user.username) {
    let insertQuery =
      "INSERT INTO `property` ( `bed`, `bath`, `country`, `address`, `unit`, `city`, `state`,`zip`,`headline`,`description`,`houseType`,`capacity`,`currency`,`rate`,`minStay`,`fromDate`,`toDate`) VALUES ('" +
      req.body.Bed +
      "', '" +
      req.body.Bath +
      "', '" +
      req.body.country +
      "', '" +
      req.body.address +
      "', '" +
      req.body.unit +
      "', '" +
      req.body.city +
      "', '" +
      req.body.state1 +
      "', '" +
      req.body.zip +
      "', '" +
      req.body.headline +
      "', '" +
      req.body.desc +
      "', '" +
      req.body.type +
      "', '" +
      req.body.capacity +
      "', '" +
      req.body.currency +
      "', '" +
      req.body.rate +
      "', '" +
      req.body.minstay +
      "', '" +
      req.body.fromDate +
      "', '" +
      req.body.toDate +
      ",')";
    let insertPropListQuery =
      "INSERT INTO `homwaway.ownerListings`(`user_id`,`prop_id`,`fromDate`,`toDate`) values ()";
    con.query(insertQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        res.status(200).send({ message: "property Listed successfully!" });
      }
    });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

/************Edit********* */

app.post("/myProfile/:id", function(req, res) {
  var sql =
    "SELECT * FROM homeaway.user_details where user_id=" +
    mysql.escape(req.params.id);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving User Details");
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result[0]));
      console.log(JSON.stringify(result));
      console.log("JSON.stringify(result)", JSON.stringify(result));
    }
  });
});

app.post("/list-property", function(req, res) {
  console.log(req.body);

  // check user already exists
  if (req.session.user.username) {
    var prop_id = null;

    let selectQuery = "SELECT max(prop_id) from homeaway.property;";
    con.query(selectQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        console.log("result for prop_id", result);
        prop_id = result[0].prop_id;
      }
    });
    let insertQuery =
      "INSERT INTO `property` (`prop_id`, `bed`, `bath`, `country`, `address`, `unit`, `city`, `state`,`zip`,`headline`,`description`,`houseType`,`capacity`,`currency`,`rate`,`minStay`,`fromDate`,`toDate`) VALUES ('" +
      prop_id +
      "', '" +
      req.body.Bed +
      "', '" +
      req.body.Bath +
      "', '" +
      req.body.country +
      "', '" +
      req.body.address +
      "', '" +
      req.body.unit +
      "', '" +
      req.body.city +
      "', '" +
      req.body.state1 +
      "', '" +
      req.body.zip +
      "', '" +
      req.body.headline +
      "', '" +
      req.body.desc +
      "', '" +
      req.body.type +
      "', '" +
      req.body.capacity +
      "', '" +
      req.body.currency +
      "', '" +
      req.body.rate +
      "', '" +
      req.body.minstay +
      "', '" +
      req.body.fromDate +
      "', '" +
      req.body.toDate +
      ",')";
    con.query(insertQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        console.log("property inserted in property table");
        //  res.status(200).send({ message: "property Listed successfully!" });
      }
    });
    let insertPropListQuery =
      "INSERT INTO `homwaway.ownerListings`(`user_id`,`prop_id`,`fromDate`,`toDate`) VALUES ('" +
      req.body.user_id +
      "', '" +
      prop_id +
      "', '" +
      req.body.toDate +
      "', '" +
      req.body.fromDate +
      ",')";
    con.query(insertPropListQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        res.status(200).send({ message: "property Listed successfully!" });
      }
    });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

/**Book property */

app.post("/book-property", function(req, res) {
  console.log(req.body);
  // check user already exists
  if (req.session.user.username) {
    let insertQuery =
      "INSERT INTO `homeaway.travellerBookings` (`user_id`, `prop_id`, `fromDate`, `toDate`) VALUES ('" +
      req.session.user_id +
      "', '" +
      req.body.prop_id +
      "', '" +
      req.body.fromDate +
      "', '" +
      req.body.toDate +
      ",')";
    let insertPropListQuery =
      "INSERT INTO `homwaway.ownerListings`(`user_id`,`prop_id`,`fromDate`,`toDate`) values ()";
    con.query(insertQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        res.status(200).send({ message: "property booked successfully!" });
      }
    });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});
