import React, { Component } from "react";
import { Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Navbar from "./Navbar";
import Profile from "./Profie";
import Signup from "./Signup";
import ListProperty from "./ListProperty";
import Location from "./Location";
import Publish from "./Publish";
import moment from "moment";
import PropertyList from "./components/PropertyList";
import OwnerLogin from "./components/OwnerLogin";
import TripBoards from "./components/Tripboards";
import OwnerDashboard from "./components/OwnerDashboard";
import HomePage from "./components/HomePage";
import OwnerSignup from "./components/OwnerSignup";
import Inbox from "./components/MessageBox";
import { connect } from "react-redux";
class Main extends Component {
  constructor() {
    super();
    this.state = {
      propDetails: {
        Bed: 0,
        Bath: 0
      },
      userId: "",
      isAuthenticated: false,
      searchDetails: {},
      fromDate: moment(),
      toDate: moment(),
      location: "",

      isSearch: "",
      adults: "",
      kids: "",
      isSearch: false
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });

    console.log("isAuthenticated", this.state.isAuthenticated);
  };
  changeRoom(bed, bath) {
    const newState = this.state.propDetails;
    newState.Bath = bath;
    newState.Bed = bed;
    this.setState({ propDetails: newState });
  }

  getUserId = id => {
    console.log("and the id is", id);
    //  this.setState({ userId: id });
    //   localStorage.setItem("userId", id);
  };
  componentDidMount() {
    // var result = localStorage.getItem("userId");
    // this.setState({ userId: result });
    // console.log("result is", result);
  }
  handleSearchChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSearchSubmit(event) {
    console.log(JSON.stringify(this.state));
    this.setState({
      isSearch: true
    });
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
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      <div>
        <Route exact path="/" component={HomePage} />

        {/* <Route path="/login" component={Login} /> */}
        {/* <Route path="/home" component={Home} /> */}

        <Route
          exact
          path="/home"
          render={() => {
            return (
              <Home
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                change={this.handleSearchChange}
                handleDateChange={this.handleDateChange}
                location={this.state.location}
                adults={this.state.adults}
                kids={this.state.kids}
                handleSearchSubmit={this.handleSearchSubmit}
                isSearch={this.state.isSearch}
              />
            );
          }}
        />

        <Route
          exact
          path="/property-list"
          render={() => {
            return (
              <PropertyList
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                //   change={this.handleSearchChange}
                //  handleDateChange={this.handleDateChange}
                location={this.state.location}
                adults={this.state.adults}
                kids={this.state.kids}
                //  handleSearchSubmit={this.handleSearchSubmit}
                // isSearch={this.state.isSearch}
              />
            );
          }}
        />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/ownerSignup" component={OwnerSignup} />
        {/* <Route path="/profile" component={Profile} /> */}
        <Route
          path="/profile"
          render={() => {
            return <Profile userId={this.state.userId} />;
          }}
        />
        <Route
          exact
          path="/ListProperty"
          render={() => {
            return <ListProperty changeRoom={this.changeRoom.bind(this)} />;
          }}
        />
        <Route
          exact
          path="/Location"
          render={() => {
            return (
              <Location
                userid={this.state.userId}
                room={this.state.propDetails}
              />
            );
          }}
        />
        <Route
          exact
          path="/login"
          render={() => {
            return <Login loadUser={this.getUserId} />;
          }}
        />

        <Route
          exact
          path="/ownerLogin"
          render={() => {
            return <OwnerLogin loadUser={this.getUserId} />;
          }}
        />
        <Route exact path="/Publish" component={Publish} />

        <Route exact path="/tripboards" component={TripBoards} />
        <Route exact path="/OwnerDashboard" component={OwnerDashboard} />
        <Route exact path="/Inbox" component={Inbox} />
      </div>
    );
  }
}

export default Main;
