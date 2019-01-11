import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import ListProperty from "./ListProperty";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      isOwner: false,
      isTraveller: true,
      login: "Login",
      ownerLogin: "Owner Login",
      travellerLogin: "Traveller Login",
      myProfile: "",
      tripboards: "",
      ownerDashboard: "",
      open: false
    };
    this.handleOwnerLogin = this.handleOwnerLogin.bind(this);
  }
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };
  componentDidMount() {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    //  if (cookie.load("cookie")) {
    if (userType === "traveler") {
      this.setState({
        login: "Logout",
        ownerLogin: "",
        travellerLogin: "",
        tripboards: "Tripboards",
        ownerDashboard: "",
        myProfile: "My Profile"
      });
    }

    //if (cookie.load("cookieOwner")) {
    if (userType === "owner") {
      this.setState({
        login: "Logout",
        ownerLogin: "",
        travellerLogin: "",
        tripboards: "",
        ownerDashboard: "Owner Dashboard",
        myProfile: "My Profile"
      });
    }

    this.setState({
      userId: userId
    });
  }
  handleOwnerLogin = () => {
    this.setState({
      isOwner: true,
      isTraveller: false
    });
  };

  handleLogout = (name, event) => {
    if (name === "owner") {
      cookie.remove("cookieOwner", { path: "/" });
    } else cookie.remove("cookie", { path: "/" });
    localStorage.clear();
  };
  render() {
    const { classes } = this.props;
    const { open } = this.state;

    //if Cookie is set render Logout Button
    let navLogin = null;
    let homeAwayLogo = null;
    let userProfile = null;
    let listproperty = null;
    let userType = localStorage.getItem("userType");
    const userId = localStorage.getItem("userId");
    console.log("navbar user id is", userId);
    //Else display login button
    // if (!cookie.load("cookie") && !cookie.load("cookieOwner")) {
    if (userType !== "owner" && userType !== "traveler") {
      // navLogin = (
      //   <li className="site-header-scratchpad__label">
      //     <Link to="/login">
      //       <span className="glyphicon glyphicon-log-in" /> {this.state.login}
      //     </Link>
      //   </li>
      // );

      navLogin = (
        <div className="dropdown">
          <div className="dropdown" aria-labelledby="dropdownMenuButton">
            <a className="login-link" href="/login">
              {this.state.travellerLogin}
            </a>
            <a
              className="login-link"
              onClick={this.handleOwnerLogin}
              href="/ownerLogin"
            >
              {this.state.ownerLogin}
            </a>
          </div>
        </div>
      );
    } else {
      // navLogin = (
      //   <li className="site-header-scratchpad__label">
      //     <Link to="/login">
      //       <span className="glyphicon glyphicon-log-in" /> {this.state.login}
      //     </Link>
      //   </li>
      // );
    }
    //   if (cookie.load("cookieOwner"))
    if (userType === "owner")
      userProfile = (
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {/* {this.state.userId} */}
            {userId}
          </button>
          <div className="dropdown-" aria-labelledby="dropdownMenuButton">
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/ListProperty"
            >
              List Property
            </a>
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/Inbox"
            >
              Inbox
            </a>
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/ownerDashboard"
            >
              {this.state.ownerDashboard}
            </a>
            <a className="dropdown-item" href="/Profile">
              {this.state.myProfile}
            </a>
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/"
              onClick={e => this.handleLogout("owner", e)}
            >
              Logout
            </a>
          </div>
        </div>
      );
    // else if (cookie.load("cookie")) {
    else if (userType === "traveler") {
      userProfile = (
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {/* {this.state.userId} */}
            {userId}
          </button>
          <div className="dropdown-" aria-labelledby="dropdownMenuButton">
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/tripboards"
            >
              {this.state.tripboards}
            </a>
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/ListProperty"
            >
              List Property
            </a>

            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/Inbox"
            >
              Inbox
            </a>
            <a className="dropdown-item" href="/Profile">
              {this.state.myProfile}
            </a>
            <a
              className="dropdown-item"
              // onClick={this.handleOwnerLogin}
              href="/"
              onClick={e => this.handleLogout("traveller", e)}
            >
              Logout
            </a>
          </div>
        </div>
      );
    }

    let redirectVar = null;
    if (!cookie.load("cookie") && this.state.isOwner) {
      redirectVar = <Redirect to="/ownerLogin" />;
    } else if (!cookie.load("cookie") && this.state.isTraveller) {
      redirectVar = <Redirect to="/login" />;
    } else {
      listproperty = (
        <Link to="/ListProperty" className="btn btn-default btn-inverse">
          List your property
        </Link>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-inverse custom-nav">
          <div className="container-fluid">
            <div className="navbar-header" />
            <ul className="nav navbar-nav">
              <li className="">
                <Link to="/Home">
                  <img src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/moniker/homeaway_us/logo-bceheader.svg" />
                </Link>
              </li>
            </ul>

            <ul className="right-menu">
              <li />
              <li />
              <li />
              <li>{userProfile}</li>
              {navLogin}
            </ul>
            {homeAwayLogo}
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
