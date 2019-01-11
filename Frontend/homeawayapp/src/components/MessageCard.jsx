import React, { Component } from "react";
import axios from "axios";

class MessageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
      Messages: []
    };
  }

  getMessages = (propid, username) => {
    const userdata = {
      username: "sojan",
      propid: propid
    };
    axios
      .post("http://localhost:3001/get-traveler-questions/", userdata)
      .then(async response => {
        console.log(JSON.stringify(response.data));

        // this.setState({
        //   Messages: response.data.message,
        //   showMessage: true
        // });
        //     console.log("state messages", this.state.Messages);
        console.log(
          "state messages length"
          // this.state.Messages.message.length
        );
      });
  };

  render() {
    return (
      <div className="property-row row">
        <div className="image-row row col-lg-4 col-md-4 col-sm-4 col-xs-4">
          {/* <img className="property-image" src={props.imgsrc} /> */}
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
                    onClick={event => this.props.clicked(this.props.value)}
                    value={this.props.value}
                  >
                    {this.props.key}
                  </a>
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="">
                  {/* <span className="">{props.unit}</span> */}
                </div>
              </div>
            </div>
            <div className="row">
              <div className=" col-lg-12 col-md-12 col-sm-12">
                <div className="">
                  <ul className="">
                    {/* <li className="">{props.houseType}</li> */}
                    <li className="">
                      {/* <span className="">{props.bed}</span> */}
                      {/* BA */}
                    </li>
                    <li className="">
                      {/* Sleeps <span className="">{props.capacity}</span> */}
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
                      <span
                        onClick={() => this.props.clicked}
                        className="currency"
                      >
                        {this.props.propid}
                      </span>
                      {/* {props.rate} */}
                    </a>
                  </div>

                  <div className="" />
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xs-6 ">
              <div className="" />
            </div>
            <div class="bs-example">
              <a
                href="#myModal"
                class="btn btn-lg btn-primary"
                data-toggle="modal"
                onClick={data => this.getMessages(this.props.propid, "sojan")}
              >
                Show Messages
              </a>

              <div id="myModal" class="modal fade">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-hidden="true"
                      >
                        &times;
                      </button>
                      <h4 class="modal-title">Messages</h4>
                    </div>
                    <div class="modal-body">
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="Post your Question"
                        // defaultValue={this.state.Lname}
                        data-input-model-name="lastName"
                        required=""
                        onChange={this.handleChange}
                        // disabled
                      />

                      <p class="text-warning">
                        <small>
                          If you don't save, your changes will be lost.
                        </small>
                      </p>
                      <input
                        type="text"
                        className="form-control input-lg js-input-field"
                        placeholder="Post your Question"
                        // defaultValue={this.state.Lname}
                        data-input-model-name="lastName"
                        required=""
                        onChange={this.handleChange}
                        // disabled
                      />
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-default"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                      <button type="button" class="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MessageCard;
