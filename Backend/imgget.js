app.post("/getPropertyImg", function(req, res, next) {
  if (req.session.username) {
    fs.readFile(
      "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images" +
        req.body.username +
        ".jpg",
      function(err, content) {
        console.log("###img:", content);
        if (err) {
          res.writeHead(400, { "Content-type": "text/html" });
          console.log(err);
          res.end("No such image");
        } else {
          //specify the content type in the response will be an image
          let base64Image = new Buffer(content, "binary").toString("base64");

          console.log("###image in node");
          //convert image file to base64-encoded string
          res.status(200).send({ img: base64Image });
          // res.end({img : base64Image});
        }
      }
    );
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});
