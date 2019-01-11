import React, { Component } from "react";

const Details = props => {
  return (
    <div>
      <div className="panel">
        <div className="panelBody">
          <div className="space" />
          <h3>
            <span>Describe your property</span>
          </h3>
          <hr className="hr" />
          <div className="space" />
          <div>
            <span>
              Start out with a descriptive headline and a detailed summary of
              your property.
            </span>
          </div>
          <div className="space" />
          <div>
            <input
              className="panelText"
              type="text"
              name="headline"
              value={props.headline}
              onChange={props.changed}
              placeholder="Headline"
            />
          </div>
          <div className="space" />

          <div>
            <textarea
              className="panelText text-area"
              type="text"
              name="desc"
              value={props.desc}
              onChange={props.changed}
              placeholder="Property Description"
            />
          </div>
          <div className="space" />
          <div>
            <input
              className="panelText type "
              type="text"
              name="type"
              value={props.type}
              onChange={props.changed}
              placeholder="House Type"
            />
          </div>
          <div className="space" />
          <div>
            <input
              className="panelText type "
              type="type"
              name="Bed"
              defaultValue={props.Bed}
              onChange={props.changedAmenities}
              placeholder="Bedrooms"
              disabled
            />
          </div>
          <div className="space" />
          <div>
            <input
              className="panelText type "
              type="type"
              name="capacity"
              value={props.capacity}
              onChange={props.changed}
              placeholder="Accomodates"
            />
          </div>
          <div className="space" />
          <div>
            <input
              className="panelText type "
              type="type"
              name="Bath"
              defaultValue={props.Bath}
              onChange={props.changedAmenities}
              placeholder="Bathrooms"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
