import React, { Component } from "react";

class Modal extends Component {
  render() {
    return (
      <div class="bs-example">
        <a href="#myModal" class="btn btn-lg btn-primary" data-toggle="modal">
          Ask owner a question
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
                <h4 class="modal-title">Confirmation</h4>
              </div>
              <div class="modal-body">
                <input
                  type="text"
                  className="form-control input-lg js-input-field"
                  placeholder="Post ypur Question"
                  // defaultValue={this.state.Lname}
                  data-input-model-name="lastName"
                  required=""
                  onChange={this.handleChange}
                  // disabled
                />
                <p class="text-warning">
                  <small>If you don't save, your changes will be lost.</small>
                </p>
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
    );
  }
}

export default Modal;
