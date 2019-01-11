import React, { Component } from "react";
import Datepicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
const Pricing = props => {
  return (
    <div>
      <div className="panel">
        <div className="panelBody">
          <h3 className="pricing">
            Select a starting point for setting up your availability
          </h3>
          <div className="space" />
          <div>
            <span>
              <input
                type="date"
                //  selected={props.fromDate}
                onChange={date => props.handleDateChange("fromDate", date)}
                //  placeholderText="Arrive"
                //  value={moment(props.fromDate.value).format("MM-DD-YYYY")}
              />
            </span>
            <div className="space" />
            <span>
              {
                <input
                  type="date"
                  //    selected={props.toDate}
                  onChange={date => props.handleDateChange("toDate", date)}
                  // value={props.toDate}
                />
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Pricing;
