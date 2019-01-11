var kafka = require("../kafka/client");

// export const travelersignup = {
//   travelersignup
// };
exports.travelersignup = function(req, res) {
  console.log("Inside Traveller signup Request Handler");
  console.log(req.body);
  kafka.make_request(
    "traveler_signup_topic",
    {
      username: req.body.Email,
      password: req.body.Password,
      Fname: req.body.Fname,
      Lname: req.body.Lname
    },
    function(err, result) {
      if (err) {
        throw err;
      } else {
        console.log("traveler inserted");
        res.cookie("cookie", req.body.Email, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = result;

        req.session.user = result;
        res.status(200).send({ user: req.body.Email });
      }
    }
  );
};
