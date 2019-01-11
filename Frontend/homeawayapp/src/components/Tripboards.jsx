import React, { Component } from "react";
import axios from "axios";
import Trip from "../components/Trip";
import { Redirect } from "react-router";
import SelectedPropertyDetail from "../components/SelectedPropertyDetail";
import Navbar from "../Navbar";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import { latestBookingQuery } from "../queries/queries";
class TripBoards extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      fromDate: "",
      toDate: "",
      location: "",
      adults: "",
      kids: "",
      headline: "",
      Properties: [],
      currentPropID: "",
      displaylist: true,
      PropertyPhotos: [],
      isAvailable: true
    };

    this.handleClick = this.handleClick.bind(this);
  }
  async componentDidMount() {
    console.log("component did mount ", this.state);
    var photos = [];
    const data = {
      username: localStorage.getItem("userId")
    };

    const userName = localStorage.getItem("userId");
    console.log("DATA", data);
    this.props.client
      .query({
        query: latestBookingQuery,
        variables: {
          username: userName
        }
        //refetchQueries: [{ query: loginQuery }]
      })
      .then(response => {
        console.log("tripboards property ", response.data.latestbooking);

        this.setState({
          Properties: response.data.latestbooking
        });
      });

    // axios
    //   .get("http://localhost:3001/places/latestbookings/" + userName)
    //   .then(async response => {
    //     console.log("trip board response", JSON.stringify(response.data.value));
    //     if (response.data.value.length > 0) {
    //       this.setState({
    //         Properties: response.data.value,
    //         isAvailable: true
    //       });
    //     }
    //     console.log(
    //       "this.state.Properties.length",
    //       this.state.Properties.length
    //     );
    //     for (let i = 0; i < this.state.Properties.length; i++) {
    //       // const data = { id: this.state.Properties[i].prop_id };
    //       const data = {
    //         id: this.state.Properties[i].bookings.properties[0].prop_id
    //       };
    //       console.log(
    //         "inside",
    //         this.state.Properties[i].bookings.properties[0].prop_id
    //       );

    //       await axios
    //         .post("http://localhost:3001/getPropertyImg", data)
    //         .then(async response => {
    //           console.log(JSON.stringify(response.data));
    //           photos.push(response.data);
    //           this.setState({
    //             PropertyPhotos: photos
    //           });
    //           console.log("response imagee", JSON.stringify(photos));
    //           console.log("photos.length", JSON.stringify(photos.length));
    //           console.log(
    //             "PropertyPhotos",
    //             JSON.stringify(this.state.PropertyPhotos)
    //           );
    //         })
    //         .catch(error => {
    //           console.log("error", JSON.stringify(error.response.data.message));
    //           window.alert(error.response.data.message);
    //         });
    //     }
    //     var finalProperties = [];
    //     this.state.Properties.forEach(property => {
    //       this.state.PropertyPhotos.forEach(photo => {
    //         //  console.log("this.state.Propertyyy", property);
    //         // console.log("this.state.photoo", photo);
    //         console.log(
    //           "final prop ids",
    //           property.bookings.properties[0].prop_id
    //         );
    //         if (photo.propid === property.bookings.properties[0].prop_id) {
    //           property.photo = photo.img;

    //           console.log("this.state.Propertyyy", JSON.stringify(property));
    //           finalProperties.push(property);
    //         }
    //       });
    //     });
    //     this.setState({
    //       Properties: finalProperties
    //     });
    //   })
    //   .catch(error => {
    //     console.log("error", JSON.stringify(error.response.data.message));
    //     window.alert(error.response.data.message);
    //     this.setState({
    //       isAvailable: false
    //     });
    //   });
    console.log("Photos", this.state.PropertyPhotos);
    // console.log("Username", userName);

    //  console.log("this.state.Properties.length", PropertyList);
  }
  handleClick(id) {
    console.log(id);
    this.setState({
      currentPropID: id,
      displaylist: false
    });
    console.log(this.state);
  }
  render() {
    let redirectvar = null;
    if (!this.state.isAvailable) {
      redirectvar = <Redirect to="/home" />;
    }

    let userType = localStorage.getItem("userType");

    if (userType !== "traveler") {
      redirectvar = <Redirect to="/login" />;
    }

    console.log(" this.state.Properties.length", this.state.Properties.length);
    console.log("properties", this.state.PropertyPhotos);
    if (this.state.PropertyPhotos.length > 0) {
      console.log(
        "this.state.PropertyPhotos.length",
        this.state.PropertyPhotos.length
      );
      var imgsrc = "data:image/png;base64," + this.state.PropertyPhotos[0].img;
    } else {
      var imgsrc = "";
    }
    if (this.state.displaylist && this.state.Properties.length > 0) {
      return (
        <div>
          {redirectvar}
          <Navbar />
          {this.state.Properties.map((property, index) => {
            console.log("headline", property.properties[0].headline);
            return (
              <Trip
                headline={property.properties[0].headline}
                key={property.properties[0].prop_id}
                value={property.properties[0].prop_id}
                clicked={this.handleClick}
                houseType={property.properties[0].houseType}
                capacity={property.properties[0].maxadults}
                rate={property.properties[0].rate}
                // imgsrc={imgsrc}
                description={property.properties[0].description}
                unit={property.properties[0].unit}
              />
            );
          })}
        </div>
      );
    } else if (this.state.displaylist === false) {
      return (
        <div>
          <SelectedPropertyDetail
            propid={this.state.currentPropID}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        </div>
      );
    } else {
      return (
        <div>
          {redirectvar}
          <Navbar />
          <h1>No Bookings to display</h1>
        </div>
      );
    }
  }
}

export default withApollo(TripBoards);
