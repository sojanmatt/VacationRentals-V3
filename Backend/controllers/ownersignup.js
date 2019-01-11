var kafka = require("../kafka/client");

// export const ownersignup = {
//   ownersignup
// };
exports.ownersignup = function(req, res) {
  kafka.make_request(
    "owner_signup_topic",
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
        // console.log("req owner is", req);
        console.log("owner inserted");
        res.cookie("cookieOwner", req.body.Email, {
          maxAge: 9000000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = result;
        //console.log("cookie is" + cookie);

        req.session.user = result;
        res.status(200).send({ user: req.body.Email });
      }
    }
  );
};
