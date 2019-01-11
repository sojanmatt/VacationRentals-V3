import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "./Actions/UserActions";
import { loginQuery } from "./queries/queries";
import { loginMutation } from "./mutations/mutations";
import { graphql, withApollo } from "react-apollo";

import * as UserConstants from " ../../../src/Constants/UserConstants";
var jwtDecode = require("jwt-decode");
class Login extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      password: "",
      authFlag: false,
      isTraveller: true,
      isOwner: false
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

    //    this.props.login(data);
    console.log("suthflag", this.props.authFlag);
    console.log("this.props");

    this.props.client
      .query({
        query: loginQuery,
        variables: {
          username: this.state.username,
          password: this.state.password
        }
        //refetchQueries: [{ query: loginQuery }]
      })
      .then(response => {
        console.log("resp", response.data.login.username);
        var decoded = jwtDecode(response.data.login.username);
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
    // console.log("data is", data);
    // //set the with credentials to true
    // axios.defaults.withCredentials = true;
    // //make a post request with the user data
    // axios
    //   .post("http://localhost:3001/login", data)
    //   .then(response => {
    //     console.log("Status Code : ", response);
    //     if (response.status === 200) {
    //       this.setState({
    //         authFlag: true
    //       });
    //     } else {
    //       this.setState({
    //         authFlag: false
    //       });
    //       window.alert(response.data.message);
    //     }
    //     this.props.loadUser(response.data);
    //     // console.log("res.data", JSON.stringify(response.data[0].username));
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     window.alert(error);
    //   });
  };

  render() {
    let redirectVar = null;
    if (this.state.authFlag) {
      console.log("suthflag", this.state.authFlag);
      redirectVar = <Redirect to="/home" />;
    }
    return (
      <div>
        {redirectVar}
        <div className="container">
          <div className="signup">
            <h2>Log in to HomeAway</h2>
            <p>
              Need an account?{" "}
              <Link to="/signup">
                <span className="glyphicon glyphicon-log-in" /> Signup
              </Link>
            </p>
          </div>
          <div className="login-form">
            <div className="main-div">
              <div>
                <h2>Traveller Login</h2>
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

// const mapStateToProps = state => {
//   return {
//     authFlag: state.login.authFlag
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     login: data => dispatch(login(data))
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Login);
// export default graphql(loginMutation, { name: "loginMutation" })(Login);
export default withApollo(Login);
