import React, { Component } from "react";

const LocationDetails = props => {
  return (
    <div className="panel">
      <div className="panelBody">
        <div className="space" />
        <input
          className="panelText"
          type="text"
          name="country"
          value={props.country}
          onChange={props.changed}
          placeholder="country"
        />
        <div className="space" />
        <input
          className="panelText"
          type="text"
          name="address"
          value={props.address}
          onChange={props.changed}
          placeholder="Street Address"
        />
        <div className="space" />
        <input
          className="panelText"
          type="text"
          name="unit"
          value={props.unit}
          onChange={props.changed}
          placeholder="Unit"
        />
        <div className="space" />
        <input
          className="panelText"
          type="text"
          name="city"
          value={props.city}
          onChange={props.changed}
          placeholder="City"
        />
        <div className="space" />
        <input
          className="panelText"
          type="text"
          name="state1"
          value={props.state}
          onChange={props.changed}
          placeholder="State"
        />
        <div className="space" />
        <input
          className="panelText"
          type="text"
          name="zip"
          value={props.zip}
          onChange={props.changed}
          placeholder="Zip code"
        />
      </div>
    </div>
  );
};

export default LocationDetails;
