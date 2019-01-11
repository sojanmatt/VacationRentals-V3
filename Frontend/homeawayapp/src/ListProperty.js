import React, { Component } from "react";
import Odometer from "react-odometerjs";
import "odometer/themes/odometer-theme-train-station.css";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import Background from "./homeaway.jpg";
import cookie from "react-cookies";
import Location from "./Location";
import { connect } from "react-redux";
import { userActions } from "./Actions/UserActions";
import * as UserConstants from "./Constants/UserConstants";
class ListProperty extends Component {
  constructor(props) {
    super(props);
    this.changeTheRooms = props.changeRoom;
    this.state = {
      Bed: 3,
      Bath: 2
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillUnmount() {
    this.changeTheRooms(this.state.Bed, this.state.Bath);
  }
  //   componentDidMount() {
  //     this.setState({
  //       Bed: 3,
  //       Bath: 2
  //     });
  //   }
  handleDateChange = (name, date) => {
    console.log("name and date", name, date);
    if (name === "Bed") {
      this.setState({
        fromDate: date
      });
    }
    console.log("name date", date);
    if (name === "toDate") {
      this.setState({
        toDate: date
      });
    }

    //this.toggleCalendar();
  };

  IncrementItem = name => {
    console.log(name);
    console.log(this.state.Bath);
    if (name === "Bed") this.setState({ Bed: this.state.Bed + 1 });
    else if (name === "Bath") this.setState({ Bath: this.state.Bath + 1 });
  };
  DecrementItem = name => {
    if (name === "Bath") this.setState({ Bath: this.state.Bath - 1 });
    else if (name === "Bed") this.setState({ Bed: this.state.Bed - 1 });
  };

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      propDetails: {
        ...user,
        [name]: value
      },

      submitted: false
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { propDetails } = this.state;
    console.log("propDetails", propDetails);
    alert("hi");
  }
  render() {
    let redirectVar = null;
    let userType = localStorage.getItem("userType");

    if (userType !== "owner") {
      redirectVar = <Redirect to="/ownerLogin" />;
    }

    // <Location bed={this.state.propDetails.Bed} />;

    const { propDetails } = this.state;
    return (
      <div>
        {redirectVar}
        <div
          className="property-details clearfix"
          style={{ backgroundImage: `url(${Background})` }}
        >
          <div className="panel col-lg-6 col-sm-6 list-property-parent">
            <div className="headline variant-headline no-sleeps">
              Let's start with the basics
            </div>
            <div className="clearfix">
              <div className="col-lg-6 col-sm-6">
                <div className="odometer-input-label-text">Bedrooms</div>
                <div className="button-parent">
                  <button
                    className="glyphicon glyphicon-chevron-up"
                    onClick={e => this.props.incrementItem("Bed")}
                  />
                </div>
                <Odometer format="d" duration={2} value={this.props.Bed} />
                <div className="button-parent">
                  <button
                    className="glyphicon glyphicon-chevron-down"
                    onClick={e => this.props.decrementItem("Bed")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-sm-6">
                <div className="odometer-input-label-text">Bathrooms</div>
                <div className="button-parent">
                  <button
                    className="glyphicon glyphicon-chevron-up"
                    onClick={e => this.props.incrementItem("Bath")}
                  />
                </div>
                <Odometer format="d" duration={5} value={this.props.Bath} />
                <div className="button-parent">
                  <button
                    className="glyphicon glyphicon-chevron-down"
                    onClick={e => this.props.decrementItem("Bath")}
                  />
                </div>
              </div>
            </div>
            <div className="link-parent">
              <Link
                to="/Location"
                className="link btn btn-primary btn-md"
                data-wdio="nextButton"
                data-effect="ripple"
                // onClick={this.handleSubmit}
              >
                {/* <span className="ripple-container" aria-hidden="true">
                <span
                  className="ripple animate"
                  style={{ top: "-77.7969px", left: "-82.4688px" }}
                />
              </span> */}
                {/* <span className="continueButtonText">Next</span> */}
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    Bed: state.postproperty.propertyDetails.Bed,
    Bath: state.postproperty.propertyDetails.Bath
  };
};
const mapDispatchToProps = dispatch => {
  return {
    //login: data => dispatch(login(data)),
    // IncrementItem: name =>
    //   dispatch({ type: UserConstants.INCREMENT_ITEM, name: name }),
    // DecrementItem: name =>
    //   dispatch({ type: UserConstants.DECREMENT_ITEM, name: name }),
    incrementItem: name => dispatch(userActions.incrementItem(name)),
    decrementItem: name => dispatch(userActions.decrementItem(name))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListProperty);
//export default ListProperty;
