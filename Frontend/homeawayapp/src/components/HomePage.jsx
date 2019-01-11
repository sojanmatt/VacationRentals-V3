import React, { Component } from "react";
import Navbar from "../Navbar";
import Background from "../images/Homeaway.jpg";
import { connect } from "react-redux";
class HomePage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let navbar = <Navbar />;
    return (
      <div>
        <div className="Jumbotron" />
        <img
          className="bg"
          src="https://exp.cdn-hotels.com/hotels/8000000/7860000/7855900/7855822/312a6d90_z.jpg"
        />
        <div>{navbar}</div>
      </div>
    );
  }
}

export default HomePage;
