import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { ownerloginQuery } from "../../src/queries/queries";

import { graphql, withApollo } from "react-apollo";
var jwtDecode = require("jwt-decode");
class OwnerLogin extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      password: "",
      authFlag: false,
      isTraveller: false,
      isOwner: true
    };
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  //Bind the handlers to this class

  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false
    });
  }
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = e => {
    this.setState({
      username: e.target.value
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = e => {
    this.setState({
      password: e.target.value
    });
  };

  submitLogin = e => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password
    };

    console.log("data is", data);
    this.props.client
      .query({
        query: ownerloginQuery,
        variables: {
          username: this.state.username,
          password: this.state.password
        }
        //refetchQueries: [{ query: loginQuery }]
      })
      .then(response => {
        console.log("resp", response.data.ownerlogin.username);
        var decoded = jwtDecode(response.data.ownerlogin.username);
        var tid = decoded.user.type;
        var username = decoded.user._id;
        console.log("tid", tid);
        console.log("username", username);
        localStorage.setItem("userType", tid);
        localStorage.setItem("userId", username);
        this.setState({
          authFlag: true
        });
      });
    //set the with credentials to true
    //  axios.defaults.withCredentials = true;
    //make a post request with the user data
    // axios
    //   .post("http://localhost:3001/ownerlogin", data)
    //   .then(response => {
    //     console.log("Status Code : ", response.status);
    //     console.log("owner resp data", response.data);
    //     var decoded = jwtDecode(response.data);
    //     var tid = decoded.user.type;
    //     var username = decoded.user._id;
    //     localStorage.setItem("userType", tid);
    //     localStorage.setItem("userId", username);
    //     if (response.status === 200) {
    //       this.setState({
    //         authFlag: true
    //       });
    //     } else {
    //       window.alert("Invalid credentials");
    //       this.setState({
    //         authFlag: false
    //       });
    //     }
    //     this.props.loadUser(response.data);
    //     console.log("res.data", JSON.stringify(response.data));
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     window.alert("Invalid credentials");
    //   });
  };

  render() {
    let userType = localStorage.getItem("userType");
    let redirectVar = null;
    if (userType === "owner") {
      redirectVar = <Redirect to="/OwnerDashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <div className="container">
          <div className="signup">
            <h2>Owner Login</h2>
            <p>
              Need an account?{" "}
              <Link to="/ownerSignup">
                <span className="glyphicon glyphicon-log-in" /> Signup
              </Link>
            </p>
          </div>
          <div className="login-form">
            <div className="main-div">
              <div>
                <h2>Account Login</h2>
                <b>
                  <hr />
                </b>
              </div>

              <div className="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={this.passwordChangeHandler}
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <button onClick={this.submitLogin} className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(OwnerLogin);
