import React, { Component } from "react";
import axios from "axios";

class PropertyList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      fromDate: this.props.fromDate,
      toDate: this.props.toDate,
      location: this.props.location,
      adults: this.props.adults,
      kids: this.props.kids,
      headline: ""
    };
  }
  componentDidMount() {
    console.log("component did moiunt ", this.state);

    const data = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      location: this.state.location,
      adults: this.state.adults,
      kids: this.state.kids
    };

    console.log("DATA", data);
    axios.post("http://localhost:3001/places", data).then(response => {
      console.log(JSON.stringify(response.data[0]));

      //   this.setState({
      //     headline: response.data[0].headline
      //   });
    });
  }
  render() {
    return (
      <div className="property-row row">
        <div className="image-row col-lg-4 col-md-4 col-sm-4 col-xs-4" />
        <div className=" col-lg-8 col-md-8 col-sm-8 col-xs-8  ">
          <div className="">
            <div className="viewed-urgency-row viewed-urgency-row--simple row">
              <div className="viewed-urgency-col col-lg-12 col-md-12 col-sm-12" />
            </div>
            <div className="headline-row row hidden-xs">
              <div className="headline-col col-lg-12 col-md-12 col-sm-12">
                <h3 className="hit-headline">
                  <a
                    href="/vacation-rental/p4605413"
                    className="hit-url js-hitLink"
                    target="_blank"
                  >
                    {/* {this.state.headline} */}
                    Courtyard Palo Alto Los Altos
                  </a>
                </h3>
              </div>
            </div>
            <div className="distance-row row hidden-xs">
              <div className="distance-col col-lg-12 col-md-12 col-sm-12">
                <div className="hit-distance">
                  <span className="hit-distance-icon">
                    <svg
                      width="13"
                      height="16"
                      viewBox="2 0 29 33"
                      className="svg-pin"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>HA - Pin - Default</title>
                      <defs>
                        <path
                          d="M47 120s-12-12.373-12-19c0-6.627 5.373-12 12-12s12 5.373 12 12-12 19-12 19zm0-15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                          id="b"
                        />
                        <filter
                          x="-22.9%"
                          y="-11.3%"
                          width="145.8%"
                          height="135.5%"
                          filterUnits="objectBoundingBox"
                          id="a"
                        >
                          <feOffset
                            dy="2"
                            in="SourceAlpha"
                            result="shadowOffsetOuter1"
                          />
                          <feGaussianBlur
                            stdDeviation="1.5"
                            in="shadowOffsetOuter1"
                            result="shadowBlurOuter1"
                          />
                          <feColorMatrix
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                            in="shadowBlurOuter1"
                          />
                        </filter>
                      </defs>
                      <g
                        transform="translate(-32 -88)"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <use fill="#000" filter="url(#a)" />
                        <use className="svg-pin-internal" />
                      </g>
                    </svg>
                  </span>
                  <span className="hit-distance-message">
                    9.9 mi to San Jose center
                  </span>
                </div>
              </div>
            </div>
            <div className="accommodations-row row">
              <div className="accommodations-col col-lg-12 col-md-12 col-sm-12">
                <div className="accommodations-simple">
                  <ul className="list-unstyled accommodations accommodations-amenities">
                    <li className="accommodation accommodation--simple">
                      Studio
                    </li>
                    <li className="accommodation accommodation--simple bbs-baths">
                      <span className="bd-bth-slps-count">1</span>
                      BA
                    </li>
                    <li className="accommodation accommodation--simple bbs-sleeps hidden-xs accommodations-col--large">
                      Sleeps <span className="bd-bth-slps-count">3</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="simple-hit__price-rating-row simple-hit__price-rating-row--large">
            <div className="price-rating-col price-rating-col--left col-sm-6 col-md-6 col-lg-6 col-xs-6 ">
              <div className="hit-rating hit-rating--hasRating hit-rating--hasReviewCount">
                <div className="price-overlay">
                  <span
                    className="instant-book-icon instant-book-icon--price-aligned js-preventHitClick js-instantBookFlag hidden-xs"
                    data-placement="top"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Book now without waiting."
                  >
                    <svg
                      display="none"
                      width="0"
                      height="0"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <symbol id="svg-lightning" viewBox="0 0 50 50">
                          <title>svg-lightning</title>
                          <path d="M3.005 24.988h17.282l-12.57 21.99 39.278-29.844H26.57L40.71 3H18.716L3.005 24.987zm13.27-23.732C16.838.468 17.747 0 18.715 0H40.71c2.674 0 4.012 3.23 2.122 5.12l-8.81 9.015h12.973c2.873 0 4.102 3.648 1.815 5.386L9.533 49.366c-2.6 1.977-6.04-1.04-4.42-3.875l9.977-17.504H3.005c-2.44 0-3.86-2.756-2.44-4.74l15.71-21.99z" />
                        </symbol>
                      </defs>
                    </svg>
                  </span>
                  <div className="rate">
                    <a
                      href="/vacation-rental/p4605413"
                      className="price js-hitLink"
                      target="_blank"
                    >
                      <span className="currency">$</span>
                      283
                    </a>
                  </div>
                  <i
                    className="icon-lightning icon-warning instant-book-flag js-preventHitClick js-instantBookFlag "
                    data-placement="top"
                    data-toggle="tooltip"
                    aria-hidden="true"
                    title=""
                    data-original-title="Book now without waiting."
                  />
                  <div className="period">per night</div>
                </div>
              </div>
            </div>
            <div className="rating-col rating-col--right col-sm-6 col-md-6 col-lg-6 col-xs-6 ">
              <div className="premier-chevron__container" />
              <div className="rating-content">
                <div className="rating rating-5 " />
                <span className="review-count">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PropertyList;
