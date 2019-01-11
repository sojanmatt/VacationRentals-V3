import React, { Component } from "react";

const Rates = props => {
  return (
    <div>
      <div>
        <div className="panel">
          <div className="panelBody">
            <div className="space" />
            <h3>
              <span>How much do you want to charge?</span>
            </h3>
            <hr className="hr" />
            <div className="space" />
            <div>
              <span>
                We recommend starting with a low price to get a few bookings and
                earn some initial guest reviews. You can update your rates at
                any time.
              </span>
            </div>
            <div className="space" />
            <div>
              <input
                className="panelText"
                type="text"
                name="currency"
                value={props.currency}
                onChange={props.changed}
                placeholder="Currency"
              />
            </div>

            <div className="space" />
            <div>
              <input
                className="panelText"
                type="text"
                name="rate"
                value={props.rate}
                onChange={props.changed}
                placeholder="Nightly Base Rate"
              />
            </div>
            <div className="space" />
            <div>
              <input
                className="panelText"
                type="text"
                name="minstay"
                value={props.minstay}
                onChange={props.changed}
                placeholder="Minimum Stay"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Rates;
