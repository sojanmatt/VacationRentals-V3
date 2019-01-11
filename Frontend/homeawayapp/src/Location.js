import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocationDetails from "./components/LocationDetails";
import moment from "moment";
import cookie from "react-cookies";
import Details from "./components/Details";
import Photos from "./components/Photos";
import Pricing from "./components/Pricing";
import Rates from "./components/Rates";
import axios from "axios";
import Alert from "react-s-alert";
import Navbar from "./Navbar";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import * as UserConstants from "./Constants/UserConstants";
import { userActions } from "./Actions/UserActions";
class Location extends Component {
  constructor(props) {
    super(props);
    let img = "";
    let imgFile = "";

    // Not needed. Handled at App.js
    // TODO: this.props.dispatch(userActions.logout());

    this.state = {
      propDetails: {
        Bed: this.props.Bed,
        Bath: this.props.Bath,
        country: "",
        address: "",
        unit: "",
        city: "",
        state1: "",
        zip: "",

        headline: "",
        desc: "",
        type: "",
        capacity: "",

        currency: "",
        rate: "",
        minstay: ""
      },
      photos: [],
      fromDate: moment(),
      toDate: moment(),
      showLoc: true,
      showDetail: false,
      showPricing: false,
      showPhotos: false,
      showRates: false,
      isUploaded: false,
      userid: "",
      isListed: false,
      Bed: "",
      Bath: ""
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.changedAmeneties = this.changedAmeneties.bind(this);
    console.log(this.state);
  }

  componentDidMount() {
    this.props.getPropertyid();

    this.setState({
      userid: localStorage.getItem("userId")
    });
  }
  uploadFiles = files => {
    const uploadFiles = new FormData();
    var filenames = "";
    for (let index = 0; index < files.length; index++) {
      if (index === files.length - 1) {
        filenames = filenames.concat(files[index][0].name);
      } else {
        filenames = filenames.concat(files[index][0].name + ",");
      }
      uploadFiles.append("file", files[index][0]);
    }
    // this.props.uploadFiles(uploadFiles);
    console.log("uploadFiles", uploadFiles);
    axios.post("http://localhost:3001/upload-files", uploadFiles).then(
      response => {
        console.log("after upload file");
        console.log(response.data.message);
        Alert.info(response.data.message, {
          effect: "jelly",
          timeout: 1500,
          offset: 50
        });
      },
      error => {
        console.log(error);
      }
    );

    return filenames;
  };

  handleDateChange = (name, date) => {
    console.log("name and date", name, date.target.value);
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
  handlelistProperty = event => {
    event.preventDefault();
    if (this.state.showRates) {
      console.log("this.state.propDetails", this.state.propDetails);
      let file = this.state.photos;
      console.log("state photos", this.state.photos);
      if (file.length > 0) {
        let filenames = "";
        filenames = this.uploadFiles(file);

        const propDetails = {
          propDetails: this.state.propDetails,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
          userid: this.state.userid,
          Bed: this.props.Bed,
          Bath: this.props.Bath
        };
        console.log(propDetails);
        //     this.props.listProperty(propDetails);
        axios
          .post("http://localhost:3001/list-property", propDetails)
          .then(
            response => {
              console.log(response.data.message);

              window.alert(response.data.message);
              this.setState({
                isListed: true
              });
            },
            error => {
              // dispatch(alertActions.projectPostError(error.data.message));
            }
          )
          .catch(error => {
            console.log(error);
            window.alert(error);
          });
      }
    } else {
      if (this.state.showLoc) {
        this.setState({
          showLoc: false,
          showDetail: true,
          showPricing: false,
          showPhotos: false,
          showRates: false
        });
      } else if (this.state.showDetail) {
        this.setState({
          showLoc: false,
          showDetail: false,
          showPricing: false,
          showPhotos: true,
          showRates: false
        });
      } else if (this.state.showPhotos) {
        this.setState({
          showLoc: false,
          showDetail: false,
          showPricing: true,
          showPhotos: false,
          showRates: false
        });
      } else if (this.state.showPricing) {
        this.setState({
          showLoc: false,
          showDetail: false,
          showPricing: false,
          showPhotos: false,
          showRates: true
        });
      }
    }
  };

  inputHandler(event) {
    const { name, value } = event.target;
    const propDetails = this.state.propDetails;
    this.setState({
      propDetails: {
        ...propDetails,
        [name]: value
      }
    });
    console.log(this.state.propDetails);
    console.log("BEd and Bath", this.props.Bed, this.props.Bath);
  }

  changedAmeneties(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleLocationChange = id => {
    if (id === 1) {
      this.setState({
        showLoc: true,
        showDetail: false,
        showPricing: false,
        showPhotos: false,
        showRates: false
      });
    }
    if (id === 2) {
      this.setState({
        showLoc: false,
        showDetail: true,
        showPricing: false,
        showPhotos: false,
        showRates: false
      });
    }
    if (id === 3) {
      this.setState({
        showLoc: false,
        showDetail: false,
        showPricing: false,
        showPhotos: true,
        showRates: false
      });
    }
    if (id === 4) {
      this.setState({
        showLoc: false,
        showDetail: false,
        showPricing: true,
        showPhotos: false,
        showRates: false
      });
    }
    if (id === 5) {
      this.setState({
        showLoc: false,
        showDetail: false,
        showPricing: false,
        showPhotos: false,
        showRates: true
      });
    }
  };
  onDrop = (acceptedFiles, rejectedFiles) => {
    var photos = [...this.state.photos];
    console.log("acceptedFiles", acceptedFiles);
    console.log("this.state.photos", this.state.photos);
    photos.push(acceptedFiles);
    this.setState({
      photos: photos,
      isUploaded: true,
      showPhotos: true
    });
    console.log("photos", photos);
  };
  handleDeleteFile = (event, name) => {
    event.preventDefault();

    console.log("event.target.value", name);
    var fileName = name;
    var oldPhotos = [...this.state.photos];

    var newPhotos = [];
    for (let position = 0; position < oldPhotos.length; position++) {
      if (oldPhotos[position][0].name === fileName) {
        newPhotos = oldPhotos.splice(position, 1);
      }
    }
    console.log("newPhotos", newPhotos);

    {
      this.setState({
        photos: oldPhotos
      });
    }
  };
  render() {
    let redirectVar = null;
    // if (!cookie.load("cookieOwner")) {
    //   redirectVar = <Redirect to="/login" />;
    // }
    let userType = localStorage.getItem("userType");

    if (userType !== "owner") {
      redirectVar = <Redirect to="/ownerLogin" />;
    }
    if (this.state.isListed) {
      redirectVar = <Redirect to="/OwnerDashboard" />;
    }

    let location = null;
    let detail = null;
    let photos = null;
    let pricing = null;
    let rates = null;
    if (this.state.showLoc) {
      location = (
        <LocationDetails
          country={this.state.propDetails.country}
          address={this.state.propDetails.address}
          city={this.state.propDetails.city}
          state={this.state.propDetails.state1}
          zip={this.state.propDetails.zip}
          unit={this.state.propDetails.unit}
          changed={this.inputHandler}
        />
      );
    }

    if (this.state.showDetail) {
      detail = (
        <Details
          headline={this.state.headline}
          desc={this.state.propDetails.desc}
          type={this.state.propDetails.type}
          Bed={this.props.Bed}
          Bath={this.props.Bath}
          capacity={this.state.propDetails.capacity}
          changed={this.inputHandler}
          changedAmeneties={this.changedAmeneties}
        />
      );
    }
    if (this.state.showPhotos) {
      photos = (
        <Photos
          onDrop={this.onDrop}
          photos={this.state.photos}
          isUploaded={this.state.isUploaded}
          clicked={this.handleDeleteFile}
        />
      );
    }

    if (this.state.showPricing) {
      //  const fromDate = moment().toDate();

      pricing = (
        <Pricing
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          clicked={this.handleDeleteFile}
          handleDateChange={this.handleDateChange}
        />
      );
    }

    if (this.state.showRates) {
      rates = (
        <Rates
          currency={this.state.propDetails.currency}
          rate={this.state.propDetails.rate}
          minstay={this.state.propDetails.minstay}
          changed={this.inputHandler}
        />
      );
    }
    return (
      <div className="">
        <Navbar />
        {/* <div className="Location-parent">
          <div className="form-group col-lg-12">
            <input
              onChange={this.searchChangeHandler}
              type="text"
              className="form-control"
              name="place"
              placeholder="Select Location!"
            />
          </div>
          <div className="form-group col-lg-4">
            <Link
              to="/Publish"
              className="link btn btn-primary"
              data-wdio="nextButton"
              data-effect="ripple"
            >
              {this.props.room.Bed} | {this.props.room.Bath}
            </Link>
          </div>
        </div> */}
        {redirectVar}

        <div className="col-md-3 nav-panel ">
          <ul className="nav-list li">
            <li>
              <a
                href="#"
                onClick={() => this.handleLocationChange(1)}
                // className="link btn btn-primary"
                data-wdio="nextButton"
                data-effect="ripple"
              >
                Location
              </a>
            </li>
            <li>
              <a
                href="#"
                //    className="link btn btn-primary"
                data-wdio="nextButton"
                data-effect="ripple"
                onClick={() => this.handleLocationChange(2)}
              >
                Details
              </a>
            </li>
            <li>
              <a
                href="#"
                //    className="link btn btn-primary"
                data-wdio="nextButton"
                data-effect="ripple"
                onClick={() => this.handleLocationChange(3)}
              >
                Photos
              </a>
            </li>
            <li>
              <a
                href="#"
                //     className="link btn btn-primary"
                data-wdio="nextButton"
                data-effect="ripple"
                onClick={() => this.handleLocationChange(4)}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                //    className="link btn btn-primary"
                data-wdio="nextButton"
                data-effect="ripple"
                onClick={() => this.handleLocationChange(5)}
              >
                Rental Rates
              </a>
            </li>
          </ul>
        </div>

        <div className="col-md-6 nav-panel">
          {location}
          {detail}
          {photos}
          {pricing}
          {rates}
        </div>
        <div className="panel-footer">
          <div className="panel-btn">
            <div className="col-xs-5" />
            <div className="col-xs-5">
              <button
                onClick={event => this.handlelistProperty(event)}
                className="panel-btn"
              >
                Next
              </button>
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
    Bath: state.postproperty.propertyDetails.Bath,
    isListed: state.postproperty.isListed,
    isUploaded: state.postproperty.isUploaded
  };
};
const mapDispatchToProps = dispatch => {
  return {
    //login: data => dispatch(login(data)),
    IncrementItem: name =>
      dispatch({ type: UserConstants.INCREMENT_ITEM, name: name }),
    DecrementItem: name =>
      dispatch({ type: UserConstants.DECREMENT_ITEM, name: name }),
    //    dispatch(userActions.uploadFiles()),
    //  uploadFiles: data => dispatch(userActions.uploadFile(data)),
    //   listProperty: data => dispatch(userActions.listProperty(data)),
    getPropertyid: () => dispatch(userActions.getcurrentpropid())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location);

//export default Location;
