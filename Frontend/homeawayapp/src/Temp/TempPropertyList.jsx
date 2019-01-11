import React, { Component } from "react";
import axios from "axios";
import Property from "../components/Property";
import SelectedPropertyDetail from "../components/SelectedPropertyDetail";
import Navbar from "../Navbar";
import { connect } from "react-redux";
class PropertyList extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      fromDate: this.props.fromDate,
      toDate: this.props.toDate,
      location: this.props.location,
      adults: this.props.adults,
      kids: this.props.kids,
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
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      location: this.state.location,
      adults: this.state.adults,
      kids: this.state.kids
    };
    const userName = { username: localStorage.getItem("userId") };
    console.log("DATA", data);

    axios.post("http://localhost:3001/places", data).then(async response => {
      console.log(JSON.stringify(response.data));

      this.setState({
        Properties: response.data
      });
      console.log("this.state.Properties.length", this.state.Properties.length);
      for (let i = 0; i < this.state.Properties.length; i++) {
        const data = { id: this.state.Properties[i].prop_id };
        console.log("inside", this.state.Properties[i].prop_id);

        await axios
          .post("http://localhost:3001/getPropertyImg", data)
          .then(async response => {
            console.log(JSON.stringify(response.data));
            photos.push(response.data);
            this.setState({
              PropertyPhotos: photos
            });
            console.log("response imagee", JSON.stringify(photos));
            console.log("photos.length", JSON.stringify(photos.length));
            console.log(
              "PropertyPhotos",
              JSON.stringify(this.state.PropertyPhotos)
            );
          });
      }
      var finalProperties = [];
      this.state.Properties.forEach(property => {
        this.state.PropertyPhotos.forEach(photo => {
          //  console.log("this.state.Propertyyy", property);
          //console.log("this.state.photoo", photo);
          if (photo.propid === property.prop_id) {
            property.photo = photo.img;

            console.log("this.state.Propertyyy", JSON.stringify(property));
            finalProperties.push(property);
          }
        });
      });
      this.setState({
        Properties: finalProperties
      });
    });

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
    if (this.state.displaylist) {
      return (
        <div>
          <Navbar />
          {this.state.Properties.map((property, index) => {
            return (
              <Property
                headline={property.headline}
                key={property.prop_id}
                value={property.prop_id}
                bath={property.bath}
                bed={property.bed}
                unit={property.unit}
                clicked={this.handleClick}
                houseType={property.houseType}
                capacity={property.capacity}
                rate={property.rate}
                imgsrc={"data:image/png;base64," + property.photo}
              />
            );
          })}
        </div>
      );
    } else
      return (
        <div>
          <SelectedPropertyDetail
            propid={this.state.currentPropID}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        </div>
      );
  }
}

export default PropertyList;
