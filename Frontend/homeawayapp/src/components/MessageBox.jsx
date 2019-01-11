import React, { Component } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import DisplayMessage from "../components/MessageCard";
class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false
    };
  }

  handleClick = () => {};
  componentDidMount() {
    const userName = {
      username: "sojan"
    };
    axios
      .post("http://localhost:3001/get-questions/", userName)
      .then(async response => {
        console.log(JSON.stringify(response.data));

        this.setState({
          Messages: response.data.message,
          showMessage: true
        });
        console.log("state messages", this.state.Messages);
        console.log(
          "state messages length"
          // this.state.Messages.message.length
        );
        //   console.log(
        //     "this.state.Properties.length",
        //     this.state.Properties.length
        //   );
        //   for (let i = 0; i < this.state.Properties.length; i++) {
        //     const data = { id: this.state.Properties[i].prop_id };
        //     console.log("inside", this.state.Properties[i].prop_id);

        //     await axios
        //       .post("http://localhost:3001/getPropertyImg", data)
        //       .then(async response => {
        //         console.log(JSON.stringify(response.data));
        //         photos.push(response.data);
        //         this.setState({
        //           PropertyPhotos: photos
        //         });
        //         console.log("response imagee", JSON.stringify(photos));
        //         console.log("photos.length", JSON.stringify(photos.length));
        //         console.log(
        //           "PropertyPhotos",
        //           JSON.stringify(this.state.PropertyPhotos)
        //         );
        //       });
        //   }
        //   var finalProperties = [];
        //   this.state.Properties.forEach(property => {
        //     this.state.PropertyPhotos.forEach(photo => {
        //       //  console.log("this.state.Propertyyy", property);
        //       //console.log("this.state.photoo", photo);
        //       if (photo.propid === property.prop_id) {
        //         property.photo = photo.img;

        //         console.log("this.state.Propertyyy", JSON.stringify(property));
        //         finalProperties.push(property);
        //       }
        //     });
        //   });
        //   this.setState({
        //     Properties: finalProperties
        //   });
      })
      .catch(error => {
        console.log("error", JSON.stringify(error.response.data.message));
        window.alert(error.response.data.message);
      });
  }
  render() {
    let emptyBox = null;
    if (!this.state.showMessage) {
      emptyBox = (
        <div className="text-center">
          <span className="text-brand" />
          <p>No messages</p>
          <a
            href="#"
            className="btn btn-primary btn--nowrap se-search-button"
            data-bypass="true"
            data-effect="ripple"
          >
            Start your search
          </a>
        </div>
      );
    } else if (this.state.showMessage) {
      return (
        <div>
          <Navbar />
          {this.state.Messages.map((message, i) => {
            return (
              <DisplayMessage
                //   headline={property.headline}
                key={message.message_id}
                propid={message.messages[i].prop_id}
                //       value={property.prop_id}
                //       bath={property.bath}
                //     bed={property.bed}
                //   unit={property.unit}
                clicked={this.handleClick}
                //    houseType={property.houseType}
                //    capacity={property.capacity}
                //    rate={property.rate}
                //imgsrc={"data:image/png;base64," + property.photo}
              />
            );
          })}
        </div>
      );
    }
    return (
      <div>
        <Navbar />
        {emptyBox}
      </div>
    );
  }
}

export default MessageBox;
