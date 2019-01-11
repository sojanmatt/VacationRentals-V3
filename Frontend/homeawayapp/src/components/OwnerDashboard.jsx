import React, { Component } from "react";
import axios from "axios";
import OwnerProperty from "../components/OwnerProperty";
import OwnerSelectedPropertyDetail from "../components/OwnerSelectedPropertyDetail";
import Navbar from "../Navbar";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import { ownerDashboardQuery } from "../queries/queries";
class OwnerDashboard extends Component {
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
      PropertyPhotos: []
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
    console.log("DATA", userName);
    this.props.client
      .query({
        query: ownerDashboardQuery,
        variables: {
          username: userName
        }
        //refetchQueries: [{ query: loginQuery }]
      })
      .then(response => {
        console.log("owner dashboard property ", response.data.ownerdashboard);

        this.setState({
          Properties: response.data.ownerdashboard
        });
      });
    // axios
    //   .get("http://localhost:3001/properties/latestlistings/" + userName)
    //   .then(async response => {
    //     console.log(JSON.stringify(response.data.value));

    //     this.setState({
    //       Properties: response.data.value
    //     });
    //     console.log(
    //       "this.state.Properties.length",
    //       this.state.Properties.length
    //     );
    //     console.log(
    //       "this.state.Property",
    //       JSON.stringify(this.state.Properties)
    //     );
    //     for (let i = 0; i < this.state.Properties.length; i++) {
    //       // const data = { id: this.state.Properties[i].prop_id };
    //       const data = { id: this.state.Properties[i].properties.prop_id };
    //       //    console.log("inside", this.state.Properties[i].prop_id);
    //       console.log("inside", this.state.Properties[i].properties.prop_id);

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
    //         });
    //     }
    //     var finalProperties = [];
    //     this.state.Properties.forEach(property => {
    //       this.state.PropertyPhotos.forEach(photo => {
    //         //  console.log("this.state.Propertyyy", property);
    //         //console.log("this.state.photoo", photo);
    //         if (photo.propid === property.properties.prop_id) {
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
    //   });
    // console.log("Photos", this.state.PropertyPhotos);
    // console.log("Username", userName);

    //  console.log("this.state.Properties.length", PropertyList);
  }
  handleClick(id) {
    console.log("current Propid", id);
    this.setState({
      currentPropID: id,
      displaylist: false
    });
    console.log(this.state);
  }
  render() {
    let userType = localStorage.getItem("userType");
    let redirectVar = null;
    if (userType === "traveler") {
      redirectVar = <Redirect to="/home" />;
    } else if (userType !== "traveler" && userType !== "owner") {
      redirectVar = <Redirect to="/ownerLogin" />;
    }
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
          {redirectVar}
          <Navbar />
          {this.state.Properties.map((property, index) => {
            return (
              <OwnerProperty
                headline={property.properties.headline}
                key={property.properties.prop_id}
                value={property.properties.prop_id}
                clicked={this.handleClick}
                bath={property.properties.bath}
                bed={property.properties.bed}
                houseType={property.properties.type}
                capacity={property.properties.maxadults}
                rate={property.properties.rate}
                unit={property.properties.unit}
                //    imgsrc={"data:image/png;base64," + property.photo}
              />
            );
          })}
        </div>
      );
    } else if (this.state.Properties.length === 0) {
      return (
        <div>
          {redirectVar}
          <Navbar />
          <h1>No Properties to display</h1>
        </div>
      );
    } else
      return (
        <div>
          <OwnerSelectedPropertyDetail propid={this.state.currentPropID} />
        </div>
      );
  }
}

export default withApollo(OwnerDashboard);
