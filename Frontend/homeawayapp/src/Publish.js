import React, { Component } from "react";
class Publish extends Component {
  state = {};
  render() {
    return (
      <div className="nav-container col-md-3">
        <div id="checklist-nav-container">
          <div className="dash-checklist-container nav-dash nav-dash-bce">
            <ul className="nav-list">
              <li
                className="dash-checklist-item "
                data-automation-className="summary"
              >
                <span>
                  <div className="dash-checklist-status checklist-status-" />
                  <a href="#" alt="Welcome" className="dash-checklist-label">
                    Welcome
                  </a>
                </span>
              </li>
              <li
                className="dash-checklist-item "
                data-automation-className="location"
              >
                <span>
                  <div className="dash-checklist-status checklist-status-inprogress">
                    <a href="#" alt="Welcome" className="dash-checklist-label">
                      Location
                    </a>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Publish;
