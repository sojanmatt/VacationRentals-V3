import React, { Component } from "react";

import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Datepicker from "react-datepicker";
import Background from "./homeaway.jpg";
import Navbar from "./Navbar";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { userActions } from "./Actions/UserActions";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      adults: "",
      kids: "",
      fromDate: "",
      toDate: "",
      isSearch: false
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchSubmit = e => {
    e.preventDefault();
    const data = this.state;
    console.log("search data", JSON.stringify(data));
    localStorage.setItem("location", data.location);
    localStorage.setItem("fromDate", data.fromDate);
    localStorage.setItem("toDate", data.toDate);

    //  this.props.searchProperty(data);
    this.setState({
      isSearch: true
    });
  };
  handleSearchChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log("inside event", this.state);
  }
  handleDateChange = (name, date) => {
    console.log("name and date", name, date.target.value);
    //const date1 = date.toDate();

    if (name === "fromDate") {
      this.setState({
        fromDate: date.target.value
      });
    }
    console.log("name date", date.target.value);

    if (name === "toDate") {
      this.setState({
        toDate: date.target.value
      });
    }

    //this.toggleCalendar();
  };

  render() {
    let userType = localStorage.getItem("userType");
    console.log("inside home");
    console.log(userType);
    console.log("props search", this.props.isSearch);
    let redirectVar = null;
    let navbar = <Navbar />;
    console.log(cookie.load("cookie"));
    if (userType === "owner") {
      redirectVar = <Redirect to="/ownerDashboard" />;
    } else if (userType !== "owner" && userType !== "traveler") {
      redirectVar = <Redirect to="/login" />;
    } else if (this.state.isSearch) {
      console.log("inside property list redirect");
      redirectVar = <Redirect to="/property-list" />;
    }

    return (
      <div>
        {redirectVar}

        <div className="">
          {navbar}
          <div
            className="property-details clearfix"
            style={{ backgroundImage: `url(${Background})` }}
          >
            <h1 className="headLine">
              <div className="HeadLine__text">Book beach houses, cabins,</div>
              <div className="HeadLine__text">condos and more, worldwide</div>
            </h1>
            <div className="form-group col-md-12">
              <div className="form-group col-md-4">
                <input
                  onChange={this.handleSearchChange}
                  type="text"
                  className="form-control"
                  name="location"
                  placeholder="Where do you want to go!"
                />
              </div>

              <span className="date-picker col-md-2">
                <input
                  type="date"
                  //  selected={this.state.fromDate}
                  onChange={date => this.handleDateChange("fromDate", date)}
                  name="fromDate"
                  required
                />
              </span>
              <span className="date-picker col-md-2">
                <input
                  type="date"
                  //selected={this.state.toDate}
                  onChange={date => this.handleDateChange("toDate", date)}
                  name="toDate"
                  required
                />
              </span>
              <div className="form-group col-md-1">
                <input
                  onChange={this.handleSearchChange}
                  type="text"
                  className="form-control"
                  name="adults"
                  placeholder="Adults"
                  //value={props.guests}
                  required
                />
              </div>
              <div className="form-group col-md-1">
                <input
                  onChange={this.handleSearchChange}
                  type="text"
                  className="form-control"
                  name="kids"
                  placeholder="kids"
                  required
                  //value={props.guests}
                />
              </div>
              <div className="form-group col-md-2">
                <button
                  className="btn btn-primary btn-lg "
                  data-effect="ripple"
                  type="button"
                  tabIndex="5"
                  data-loading-animation="true"
                  onClick={this.handleSearchSubmit}
                >
                  Search
                </button>
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
    isSearch: state.bookproperty.isSearch,
    isNewSearch: state.bookproperty.isNewSearch
  };
};
const mapDispatchtoProps = dispatch => {
  return {
    searchProperty: data => dispatch(userActions.searchProperty(data))
  };
};
//export Home Component
export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(Home);
