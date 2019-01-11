import React, { Component } from "react";

const OwnerProperty = props => {
  return (
    <div className="property-row row">
      <div className="image-row row col-lg-4 col-md-4 col-sm-4 col-xs-4">
        <img className="property-image" src={props.imgsrc} />
      </div>
      <div className=" col-lg-8 col-md-8 col-sm-8 col-xs-8  ">
        <div className="">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12" />
          </div>
          <div className="">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <h3 className="hit-headline">
                <a
                  onClick={event => props.clicked(props.value)}
                  value={props.value}
                >
                  {props.headline}
                </a>
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="">
                <span className="">{props.unit}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className=" col-lg-12 col-md-12 col-sm-12">
              <div className="">
                <ul className="">
                  <li className="">{props.houseType}</li>
                  <li className="">
                    <span className="">{props.bed}</span>
                    BA
                  </li>
                  <li className="">
                    Sleeps <span className="">{props.capacity}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="col-sm-6 col-md-6 col-lg-6 col-xs-6 ">
            <div className="">
              <div className="">
                <div className="rate">
                  <a
                    href="/vacation-rental/p4605413"
                    className="price js-hitLink"
                    target="_blank"
                  >
                    <span className="currency">$</span>
                    {props.rate}
                  </a>
                </div>

                <div className="">per night</div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-6 col-lg-6 col-xs-6 ">
            <div className="" />
            <div className="">
              <div className=" " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProperty;
