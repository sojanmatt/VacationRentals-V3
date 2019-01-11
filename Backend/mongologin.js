app.post("/login", function(req, res) {
  MongoClient.connect(
    url,
    function(err, client) {
      if (err) {
        throw err;
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        var username = req.body.username;
        var password = req.body.password;
        const db = client.db(dbName);
        console.log("Database Connected");
        db.collection("HomeAway").findOne(
          { User: { $elemMatch: { username: req.body.username } } },
          function(findErr, result) {
            if (findErr) {
              throw findErr;
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("Invalid Credentials");
            } else {
              //console.log("Heretoo" + JSON.stringify(result.User[0].password)+ password)
              bcrypt.compare(
                req.body.password,
                result.User[0].password,
                function(err, answer) {
                  //  let answer = (result.password === password)
                  console.log("answer is " + JSON.stringify(answer));
                  if (answer) {
                    console.log("Herethree");
                    res.cookie("cookie", req.body.username, {
                      maxAge: 9000000,
                      httpOnly: false,
                      path: "/"
                    });
                    req.session.user = result;
                    console.log("Successfully retrieving User");
                    console.log("Username is " + JSON.stringify(username));
                    res.status(200).send(JSON.stringify(username));
                    res.end("Successful Login");
                  } //if
                  else {
                    res.writeHead(400, {
                      "Content-Type": "text/plain"
                    });
                    res.end("Invalid Credentials");
                  }
                }
              ); //bcrypt
            } //else
          }
        ); //db collection
      } //else
    }
  ); //mongoClient
}); //app
