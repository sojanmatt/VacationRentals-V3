import React from "react";
import { connect } from "react-redux";

import freeLogo from "../Images/fl-logo.svg";
import plusIcon from "../Images/plus_icon.png";
import uploadIcon from "../Images/upload_file.png";
import { RESTService } from "../API";
import DatePicker from "react-datepicker";
import moment from "moment";
import Dropzone from "react-dropzone";
import filesize from "filesize";
import { history } from "../Helpers";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "react-s-alert";

class PostProject extends React.Component {
  /* constructor(props) {
        super(props);
};*/

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: "POST_A_PROJECT" });

    this.state = {
      projectName: "",
      projectDescription: "",
      projectSkills: "",
      projectPay: "",
      projectFiles: [],
      selectPay: "fixedPay",
      completeByDate: moment(),
      isSubmitted: false,
      isOpen: false,
      isUploaded: false
    };
  }
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleToggle = event => {
    this.setState({
      selectPay: event.target.value
    });
  };

  handleDateChange = date => {
    this.setState({
      completeByDate: date
    });
    this.toggleCalendar();
  };

  toggleCalendar = e => {
    e && e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    var projectFiles = this.state.projectFiles;
    projectFiles.push(acceptedFiles);
    this.setState({
      projectFiles: projectFiles,
      isUploaded: true
    });
  };

  handleDeleteFile = event => {
    event.preventDefault();

    var fileName = event.target.value;
    var oldProjectFiles = this.state.projectFiles;
    var newProjectFiles = [];
    for (let position = 0; position < oldProjectFiles.length; position++) {
      if (oldProjectFiles[position][0].name === fileName) {
        newProjectFiles = oldProjectFiles.splice(position, 1);
      }
    }

    this.setState({ isSubmitted: false });

    if (!newProjectFiles) {
      this.setState({
        projectFiles: newProjectFiles
      });
    }
  };

  handlePostProject = event => {
    event.preventDefault();

    this.setState({ isSubmitted: true });

    let name = this.state.projectName;
    let desc = this.state.projectDescription;
    let skills = this.state.projectSkills;
    let pay = this.refs.projectPay.value;
    let date = this.state.completeByDate.format("YYYY-MM-DD");
    let file = this.state.projectFiles;

    skills = skills.split(" ").join(", ");
    if (skills.trim().startsWith(",")) skills = skills.slice(1, skills.length);
    if (skills.trim().endsWith(","))
      skills = skills.slice(0, skills.length - 1);

    if (name && desc && skills) {
      let filenames = "";
      if (file.length > 0) {
        filenames = this.uploadFiles(file);
      }

      const project = {
        title: name,
        description: desc,
        budget_range: pay,
        skills_req: skills,
        status: "Open",
        complete_by: date,
        filenames: filenames
      };

      RESTService.postProject(project).then(
        response => {
          console.log(response.data.message);

          // Alert.info(response.data.message, {
          //     effect: 'jelly',
          //     timeout: 1500,
          //     offset: 50
          // });
          window.alert(response.data.message);
        },
        error => {
          //  dispatch(alertActions.projectPostError(error.data.message));
        }
      );

      history.push("/HomePage");
    }
  };

  uploadFiles = files => {
    const uploadFiles = new FormData();
    var filenames = "";
    for (let index = 0; index < files.length; index++) {
      if (index === files.length - 1) {
        filenames = filenames.concat(files[index][0].name);
      } else {
        filenames = filenames.concat(files[index][0].name + ",");
      }
      uploadFiles.append("file", files[index][0]);
    }

    RESTService.uploadFile(uploadFiles).then(
      response => {
        console.log(response.data.message);
        Alert.info(response.data.message, {
          effect: "jelly",
          timeout: 1500,
          offset: 50
        });
      },
      error => {
        console.log(error);
      }
    );

    return filenames;
  };

  render() {
    const {
      projectName,
      projectDescription,
      projectSkills,
      projectFiles,
      selectPay,
      isSubmitted,
      completeByDate,
      isOpen,
      isUploaded
    } = this.state;

    return (
      <div>
        <div className="jumbotron">
          <div className="col-sm-10 col-sm-offset-1">
            <div className="col-md-12 col-md-offset-0">
              <div className="panel panel-primary" id="shadowpanel">
                <div className="pp-container">
                  <div className="pp-bg-container">
                    <div className="pp-bg">
                      <div className="pp-shape pp-big" />
                      <div className="pp-shape pp-medium" />
                      <div className="pp-shape pp-small" />
                    </div>
                  </div>

                  <div className="pp-header">
                    <div className="pp-header-logo">
                      <a href="/HomePage">
                        <img
                          className="header-logo-fullcolor"
                          src={freeLogo}
                          alt="Freelancer"
                        />
                      </a>
                    </div>
                    <div>
                      <h1 className="header-title">
                        Tell us what you need done
                      </h1>
                      <p className="header-desc">
                        Get free quotes from skilled freelancers within minutes,
                        view profiles, ratings and portfolios and chat with
                        them. Pay the freelancer only when you are 100%
                        satisfied with their work.
                      </p>
                    </div>
                  </div>

                  <div>
                    <form onSubmit={this.handlePostProject}>
                      <ol className="pp-form">
                        <li>
                          <div className="form-field">
                            <fieldset className="form-fieldset">
                              <legend className="form-fieldset-legend">
                                Choose a name for your project
                              </legend>
                              <ol className="pp-form">
                                <li className="form-step">
                                  <input
                                    className={
                                      `form-control pp-field-input large-input` +
                                      (isSubmitted && !projectName
                                        ? " form-step-has-error"
                                        : "")
                                    }
                                    name="projectName"
                                    // ref         = "projectName"
                                    type="text"
                                    value={projectName}
                                    onChange={this.handleChange}
                                    label="ProjectName"
                                    placeholder="e.g. Build me a website"
                                  />
                                  {isSubmitted &&
                                    !projectName && (
                                      <div className="form-error pp-form-error">
                                        Please enter a project name.
                                      </div>
                                    )}
                                </li>
                              </ol>
                            </fieldset>
                          </div>
                        </li>

                        <li>
                          <div className="form-field">
                            <fieldset className="form-fieldset">
                              <legend className="form-fieldset-legend">
                                Tell us more about your project
                              </legend>
                              <p className="form-legend-subtext">
                                Great project descriptions include a little bit
                                about yourself, details of what you are trying
                                to achieve, and any decisions that you have
                                already made about your project. If there are
                                things you are unsure of, don't worry, a
                                freelancer will be able to help you fill in the
                                blanks.
                              </p>
                              <ol className="pp-form">
                                <li className="form-step">
                                  <textarea
                                    className={
                                      `form-control pp-field-input large-textarea` +
                                      (isSubmitted && !projectDescription
                                        ? " form-step-has-error"
                                        : "")
                                    }
                                    name="projectDescription"
                                    // ref         = "projectDescription"
                                    value={projectDescription}
                                    onChange={this.handleChange}
                                    type="text"
                                    label="ProjectDescription"
                                    placeholder="Describe your project here..."
                                  />
                                  {isSubmitted &&
                                    !projectDescription && (
                                      <div className="form-error pp-form-error">
                                        Please enter a project description.
                                      </div>
                                    )}
                                </li>
                                <li className="form-step">
                                  <div>
                                    <Dropzone
                                      className="file-upload-area"
                                      onDrop={files => this.onDrop(files)}
                                    >
                                      <span className="btn btn-plain btn-file-uploader">
                                        <span>
                                          <img
                                            className="fl-icon-plus"
                                            src={plusIcon}
                                            alt=""
                                          />
                                        </span>
                                        <span className="file-upload-button-text">
                                          Upload File
                                        </span>
                                      </span>
                                      <p className="file-upload-text">
                                        Drag & drop any images or documents that
                                        might be helpful in explaining your
                                        project brief here.
                                      </p>
                                    </Dropzone>
                                    {isUploaded && (
                                      <table className="table-upload">
                                        <tbody className="table-upload-body">
                                          {projectFiles.map(data => (
                                            <tr
                                              key={projectFiles.indexOf(data)}
                                              className="table-upload-row"
                                            >
                                              <td className="table-upload-row-preview">
                                                <img
                                                  className="preview-image"
                                                  src={
                                                    data[0].type ===
                                                    "application/pdf"
                                                      ? uploadIcon
                                                      : URL.createObjectURL(
                                                          data[0]
                                                        )
                                                  }
                                                  alt=""
                                                />
                                              </td>
                                              <td className="table-upload-row-name">
                                                <span>{data[0].name}</span>
                                              </td>
                                              <td className="table-upload-row-size">
                                                {filesize(data[0].size)}
                                              </td>
                                              <td className="table-upload-row-delete">
                                                <button
                                                  value={data[0].name}
                                                  className="btn btn-danger btn-small"
                                                  onClick={
                                                    this.handleDeleteFile
                                                  }
                                                >
                                                  <span>Delete</span>
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                </li>
                              </ol>
                            </fieldset>
                          </div>
                        </li>
                        <li>
                          <div className="form-field">
                            <fieldset className="form-fieldset">
                              <legend className="form-fieldset-legend">
                                What skills are required?
                              </legend>
                              <p className="form-legend-subtext">
                                Enter up to 5 skills that best describe your
                                project. Freelancers will use these skills to
                                find projects they are most interested and
                                experienced in.
                              </p>
                              <ol className="pp-form">
                                <li className="form-step">
                                  <input
                                    className={
                                      `form-control pp-field-input large-input` +
                                      (isSubmitted && !projectDescription
                                        ? " form-step-has-error"
                                        : "")
                                    }
                                    name="projectSkills"
                                    // ref         = "projectSkills"
                                    value={projectSkills}
                                    onChange={this.handleChange}
                                    type="text"
                                    label="ProjectSkills"
                                    placeholder="What skills are required?"
                                  />
                                  {isSubmitted &&
                                    !projectSkills && (
                                      <div className="form-error pp-form-error">
                                        Please enter up to 5 project skills.
                                      </div>
                                    )}
                                </li>
                              </ol>
                            </fieldset>
                          </div>
                        </li>
                        <li>
                          <div className="form-field">
                            <fieldset className="form-fieldset">
                              <legend className="form-fieldset-legend">
                                How do you want to pay?
                              </legend>
                              <nav className="budget-tabs">
                                <ul className="budget-tabs-list Radio">
                                  <li>
                                    <input
                                      id="budgetFixed"
                                      className="Radio-input"
                                      name="fixedPay"
                                      value="fixedPay"
                                      checked={selectPay === "fixedPay"}
                                      type="radio"
                                      label="ProjectFixedPay"
                                      onChange={this.handleToggle}
                                    />
                                    <label
                                      htmlFor="budgetFixed"
                                      className="Radio-label Radio-label--large Radio-label--tab pp-radio-label"
                                    >
                                      <span className="Radio-text-label">
                                        Fixed price project
                                      </span>
                                    </label>
                                  </li>
                                  <li>
                                    <input
                                      id="budgetHourly"
                                      className="Radio-input"
                                      name="hourlyPay"
                                      value="hourlyPay"
                                      checked={selectPay === "hourlyPay"}
                                      type="radio"
                                      label="ProjectHourlyPay"
                                      onChange={this.handleToggle}
                                    />
                                    <label
                                      htmlFor="budgetHourly"
                                      className="Radio-label Radio-label--large Radio-label--tab pp-radio-label"
                                    >
                                      <span className="Radio-text-label">
                                        Hourly project
                                      </span>
                                    </label>
                                  </li>
                                </ul>
                              </nav>
                              <legend className="form-fieldset-legend">
                                What is your estimated budget?
                              </legend>
                              <ol className="budgetFields">
                                {selectPay === "fixedPay" && (
                                  <li className="form-step form-step--multiFields">
                                    <div className="form-step-fieldContainer">
                                      <select
                                        defaultValue="USD"
                                        className="large-input select-fields select-fields-fixed-curr"
                                      >
                                        <option value="USD" label="USD">
                                          USD
                                        </option>
                                        <option value="NZD" label="NZD">
                                          NZD
                                        </option>
                                        <option value="AUD" label="AUD">
                                          AUD
                                        </option>
                                        <option value="GBP" label="GBP">
                                          GBP
                                        </option>
                                        <option value="HKD" label="HKD">
                                          HKD
                                        </option>
                                        <option value="SGD" label="SGD">
                                          SGD
                                        </option>
                                        <option value="PHP" label="PHP">
                                          PHP
                                        </option>
                                        <option value="EUR" label="EUR">
                                          EUR
                                        </option>
                                        <option value="CAD" label="CAD">
                                          CAD
                                        </option>
                                        <option value="ZAR" label="ZAR">
                                          ZAR
                                        </option>
                                        <option value="INR" label="INR">
                                          INR
                                        </option>
                                        <option value="JMD" label="JMD">
                                          JMD
                                        </option>
                                        <option value="CLP" label="CLP">
                                          CLP
                                        </option>
                                        <option value="MXN" label="MXN">
                                          MXN
                                        </option>
                                        <option value="IDR" label="IDR">
                                          IDR
                                        </option>
                                        <option value="MYR" label="MYR">
                                          MYR
                                        </option>
                                        <option value="SEK" label="SEK">
                                          SEK
                                        </option>
                                        <option value="JPY" label="JPY">
                                          JPY
                                        </option>
                                        <option value="PLN" label="PLN">
                                          PLN
                                        </option>
                                        <option value="BRL" label="BRL">
                                          BRL
                                        </option>
                                        <option value="CNY" label="CNY">
                                          CNY
                                        </option>
                                        <option value="VND" label="VND">
                                          VND
                                        </option>
                                        <option value="ARS" label="ARS">
                                          ARS
                                        </option>
                                      </select>
                                    </div>
                                    <div className="form-step-fieldContainer bit-pad">
                                      <select
                                        defaultValue="$250 - $750"
                                        name="projPay"
                                        ref="projectPay"
                                        className="large-input select-fields select-fields-fixed-proj"
                                      >
                                        <option
                                          value="$10 - $30"
                                          label="Micro Project ($10 - 30 USD)"
                                        >
                                          Micro Project ($10 - 30 USD)
                                        </option>
                                        <option
                                          value="$30 - $250"
                                          label="Simple project ($30 - 250 USD)"
                                        >
                                          Simple project ($30 - 250 USD)
                                        </option>
                                        <option
                                          value="$250 - $750"
                                          label="Very small project ($250 - 750 USD)"
                                        >
                                          Very small project ($250 - 750 USD)
                                        </option>
                                        <option
                                          value="$750 - $1500"
                                          label="Small project ($750 - 1500 USD)"
                                        >
                                          Small project ($750 - 1500 USD)
                                        </option>
                                        <option
                                          value="$1500 - $3000"
                                          label="Medium project ($1500 - 3000 USD)"
                                        >
                                          Medium project ($1500 - 3000 USD)
                                        </option>
                                        <option
                                          value="$3000 - $5000"
                                          label="Large project ($3000 - 5000 USD)"
                                        >
                                          Large project ($3000 - 5000 USD)
                                        </option>
                                        <option
                                          value="$5000 - $10000"
                                          label="Larger project ($5000 - 10000 USD)"
                                        >
                                          Larger project ($5000 - 10000 USD)
                                        </option>
                                        <option
                                          value="$10000 - $20000"
                                          label="Very Large project ($10000 - 20000 USD)"
                                        >
                                          Very Large project ($10000 - 20000
                                          USD)
                                        </option>
                                        <option
                                          value="$20000 - $50000"
                                          label="Huge project ($20000 - 50000 USD)"
                                        >
                                          Huge project ($20000 - 50000 USD)
                                        </option>
                                        <option
                                          value="$50000 +  USD"
                                          label="Major project ($50000 +  USD)"
                                        >
                                          Major project ($50000 + USD)
                                        </option>
                                      </select>
                                    </div>
                                  </li>
                                )}
                                {selectPay === "hourlyPay" && (
                                  <li className="form-step form-step--multiFields">
                                    <div className="form-step-fieldContainer">
                                      <select
                                        defaultValue="USD"
                                        className="large-input select-fields-fixed select-fields select-fields-hourly-curr"
                                      >
                                        <option value="USD" label="USD">
                                          USD
                                        </option>
                                        <option value="NZD" label="NZD">
                                          NZD
                                        </option>
                                        <option value="AUD" label="AUD">
                                          AUD
                                        </option>
                                        <option value="GBP" label="GBP">
                                          GBP
                                        </option>
                                        <option value="HKD" label="HKD">
                                          HKD
                                        </option>
                                        <option value="SGD" label="SGD">
                                          SGD
                                        </option>
                                        <option value="PHP" label="PHP">
                                          PHP
                                        </option>
                                        <option value="EUR" label="EUR">
                                          EUR
                                        </option>
                                        <option value="CAD" label="CAD">
                                          CAD
                                        </option>
                                        <option value="ZAR" label="ZAR">
                                          ZAR
                                        </option>
                                        <option value="INR" label="INR">
                                          INR
                                        </option>
                                        <option value="JMD" label="JMD">
                                          JMD
                                        </option>
                                        <option value="CLP" label="CLP">
                                          CLP
                                        </option>
                                        <option value="MXN" label="MXN">
                                          MXN
                                        </option>
                                        <option value="IDR" label="IDR">
                                          IDR
                                        </option>
                                        <option value="MYR" label="MYR">
                                          MYR
                                        </option>
                                        <option value="SEK" label="SEK">
                                          SEK
                                        </option>
                                        <option value="JPY" label="JPY">
                                          JPY
                                        </option>
                                        <option value="PLN" label="PLN">
                                          PLN
                                        </option>
                                        <option value="BRL" label="BRL">
                                          BRL
                                        </option>
                                        <option value="CNY" label="CNY">
                                          CNY
                                        </option>
                                        <option value="VND" label="VND">
                                          VND
                                        </option>
                                        <option value="ARS" label="ARS">
                                          ARS
                                        </option>
                                      </select>
                                    </div>
                                    <div className="form-step-fieldContainer bit-pad">
                                      <select
                                        defaultValue="$15 - $25"
                                        name="projectPay"
                                        ref="projectPay"
                                        className="large-input select-fields select-fields-hourly-proj"
                                      >
                                        <option
                                          value="$2 - $8"
                                          label="Basic ($2 - 8 USD)"
                                        >
                                          Basic ($2 - 8 USD)
                                        </option>
                                        <option
                                          value="$8 - $15"
                                          label="Moderate ($8 - 15 USD)"
                                        >
                                          Moderate ($8 - 15 USD)
                                        </option>
                                        <option
                                          value="$15 - $25"
                                          label="Standard ($15 - 25 USD)"
                                        >
                                          Standard ($15 - 25 USD)
                                        </option>
                                        <option
                                          value="$25 - $50"
                                          label="Skilled ($25 - 50 USD)"
                                        >
                                          Skilled ($25 - 50 USD)
                                        </option>
                                        <option
                                          value="$50 +  USD"
                                          label="Expert ($50 +  USD)"
                                        >
                                          Expert ($50 + USD)
                                        </option>
                                      </select>
                                    </div>
                                  </li>
                                )}
                              </ol>
                            </fieldset>
                          </div>
                        </li>
                        <li>
                          <fieldset className="form-fieldset">
                            <legend className="form-fieldset-legend">
                              What is your estimated project completion date?
                            </legend>
                            <div>
                              <button
                                className="btn-date"
                                onClick={this.toggleCalendar}
                              >
                                {completeByDate.format("DD-MM-YYYY")}
                              </button>
                              {isOpen && (
                                <DatePicker
                                  selected={completeByDate}
                                  onChange={this.handleDateChange}
                                  onClickOutside={this.toggleCalendar}
                                  withPortal
                                  inline
                                />
                              )}
                            </div>
                          </fieldset>
                        </li>
                        <li>
                          <div className="pp-submit">
                            <button className="btn btn-xlarge pp-submit-btn btn-primary">
                              <span>Post My Project</span>
                            </button>
                          </div>
                          <p className="pp-submit-terms">
                            By clicking 'Post My Project', you agree to the
                            Terms & Conditions and Privacy Policy
                            <br />
                            If you decide to award your project we charge a 3%
                            commission (minimum project fees apply).
                          </p>
                        </li>
                      </ol>
                    </form>
                  </div>
                  <div className="pp-footer">
                    <p className="pp-footer-cp">
                      Copyright © 2018 Freelancer Technology Pty Limited (ACN
                      142 189 759)
                    </p>
                    <nav className="pp-footer-nav">
                      <span className="pp-footer-text">Privacy Policy</span>
                      <span className="pp-footer-text">
                        Terms and Conditions
                      </span>
                      <span className="pp-footer-text">
                        Copyright Infringement Policy
                      </span>
                      <span className="pp-footer-text">Code of Conduct</span>
                    </nav>
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
function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user
  };
}
const connectedPostProject = connect(mapStateToProps)(PostProject);
export { connectedPostProject as PostProject };
