import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { Redirect } from "react-router";
import axios from "axios";
import { connect } from "react-redux";
import { userActions } from "../Actions/UserActions";
import { graphql, withApollo } from "react-apollo";

import { ownersignupMutation } from "../mutations/mutations";
var jwtDecode = require("jwt-decode");
class OwnerSignup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        Fname: "",
        Lname: "",
        Email: "",
        Password: ""
      },
      isSignedup: false
    };

    this.handleChange = this.handleChange.bind(this);
    //  this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleradio = this.handleradio.bind(this);
  }

  // inputHandler(event) {
  //   const { name, value } = event.target;
  //   const propDetails = this.state.propDetails;
  //   this.setState({
  //     propDetails: {
  //       ...propDetails,
  //       [name]: value
  //     }
  //   });
  //   console.log(this.state.propDetails);
  // }
  handleChange(event) {
    const { name, value } = event.target;

    const user = this.state.user;

    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
    console.log(this.state.user);
  }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   alert("hi");
  //   const { user } = this.state;
  //   console.log(JSON.stringify(user));
  //   if (user.Fname && user.Email && user.Lname && user.Password) {
  //     console.log(JSON.stringify(user)); ///try w_ dispatch
  //   }
  // }

  handleSubmit = event => {
    event.preventDefault();
    var alphaExp = /^[a-zA-Z]+$/;
    if (
      this.state.user.Email == null ||
      this.state.user.Email == "" ||
      this.state.user.Fname == null ||
      this.state.user.Fname == "" ||
      this.state.user.Lname == null ||
      this.state.user.Lname == "" ||
      this.state.user.Password == null ||
      this.state.user.Password == ""
    ) {
      alert("Please Fill All Required Field");
      //return false;
    }
    if (
      !this.state.user.Fname.match(alphaExp) ||
      !this.state.user.Lname.match(alphaExp)
    ) {
      alert("only letters accepted");
      //  console.log("valid name");
      //return false;
    } else {
      console.log("valid name");
      //    alert("only letters accepted");
    }
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.state.user.Email
      )
    ) {
      console.log("valid email");
    } else {
      alert("You have entered an invalid email address!");
      //    return (false);
    }
    if (
      this.state.user.Email !== null &&
      this.state.user.Email !== "" &&
      this.state.user.Fname !== null &&
      this.state.user.Fname !== "" &&
      this.state.user.Lname !== null &&
      this.state.user.Lname !== "" &&
      this.state.user.Password !== null &&
      this.state.user.Password !== "" &&
      this.state.user.Fname.match(alphaExp) &&
      this.state.user.Lname.match(alphaExp) &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.state.user.Email
      )
    ) {
      console.log("valid form");
      const userDetails = this.state.user;
      //   this.props.signup(userDetails);
      //  console.log("valid form");
      this.props
        .ownersignupMutation({
          variables: {
            email: this.state.user.Email,
            fname: this.state.user.Fname,
            lname: this.state.user.Lname,
            password: this.state.user.Password
          }
        })
        .then(response => {
          console.log("resp signup", response.data.ownersignup.username);
          var decoded = jwtDecode(response.data.ownersignup.username);
          var tid = decoded.user.type;
          var username = decoded.user._id;
          console.log("tid", tid);
          console.log("username", username);
          localStorage.setItem("userType", tid);
          localStorage.setItem("userId", username);
          this.setState({
            isSignedup: true
          });
        });
    }

    // const userDetails = this.state.user;

    // console.log("userdetails", userDetails);
    // this.props.signup(userDetails);
    // axios.post("http://localhost:3001/owner/signup", userDetails).then(
    //   response => {
    //     console.log(response.data.message);

    //     window.alert(response.data.message);
    //     this.setState({
    //       isSignedup: true
    //     });
    //   },
    //   error => {
    //     window.alert("Please check again");
    //   }
    // );
  };

  render() {
    let redirect = null;
    if (this.state.isSignedup) {
      redirect = <Redirect to="/OwnerDashboard" />;
    }
    return (
      <div className="container">
        {redirect}
        <div className="signup-form">
          <div>
            <div>
              <div>
                <form name="form">
                  <div>
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Fname"
                        //    value={this.state.user.Fname}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Lname"
                        //   value={this.state.user.Lname}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Email"
                      //      value={this.state.user.Email}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="Password"
                      //  value={this.state.user.Password}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group" id="LoginButtonDiv">
                    <button
                      onClick={this.handleSubmit}
                      className="btn btn-primary"
                      id="LoginButton"
                    >
                      Sign Me Up
                    </button>

                    <p id="smallLabel2">
                      We don't post anything without your permission. By
                      creating an account you are accepting our Terms and
                      Conditions and Privacy Policy.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSignedup: state.signup.isOwnerSignedUp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: data => dispatch(userActions.ownersignup(data))
  };
};
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(OwnerSignup);
// const OwnerSignup = connect(mapStateToProps)(PropertyDisplay);
// export default graphql(property, {
//     options : (props) => ({
//         variables : {
//             propertyId: this.props != null ? this.props.match.params.id : ""
//         }
//     })

// })(PropertyDisplayPage);
//export default graphql(signupMutation, { name: "signupMutation" })(Signup);
//const OwnerSignupPage = connect(mapStateToProps,mapDispatchToProps)(OwnerSignup);
//export default withApollo(OwnerSignup);
export default graphql(ownersignupMutation, { name: "ownersignupMutation" })(
  OwnerSignup
);
