import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import fllogo from "../Images/Logo.png";
import { userActions } from "../Actions";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        Name: "",
        Email: "",
        username: "",
        password: ""
      },
      submitted: false,
      passcheck: false,
      usertype: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleradio = this.handleradio.bind(this);
  }

  handleradio(event) {
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        looking_for: event.target.value
      },
      usertype: true
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      },
      submitted: false,
      passcheck: false
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { user } = this.state;
    if (user.password === user.cpassword) {
      this.setState({ passcheck: false, submitted: true });

      const { dispatch } = this.props;
      if (this.state.usertype === false) {
        //do nothing
      } else if (user.Name && user.Email && user.username && user.password) {
        dispatch(userActions.register(user)); ///try w_ dispatch
      }
    } else {
      this.setState({ submitted: true, passcheck: true });
    }
  }

  render() {
    const { user, submitted, passcheck, usertype } = this.state;
    const { alert } = this.props;
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-sm-8 col-sm-offset-2">
            <div className="col-md-6 col-md-offset-3">
              <div className="panel panel-primary" id="shadowpanel">
                <div className="panel-body">
                  <div className="div-fl-logo">
                    {" "}
                    <img className="fl-logo" src={fllogo} alt="Freelancer" />
                  </div>

                  <div id="centertext">
                    <label>
                      Sign up for <em>free</em> today!
                    </label>
                  </div>

                  {alert.message && (
                    <aside className={`alert ${alert.type}`}>
                      {alert.message}
                    </aside>
                  )}

                  <form name="form" onSubmit={this.handleSubmit}>
                    <div
                      className={
                        "form-group" +
                        (submitted && !user.Name ? " has-error" : "")
                      }
                    >
                      <label htmlFor="firstName">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        value={user.Name}
                        onChange={this.handleChange}
                      />
                      {submitted &&
                        !user.Name && (
                          <div className="help-block">Name is required</div>
                        )}
                    </div>
                    <div
                      className={
                        "form-group" +
                        (submitted && !user.Email ? " has-error" : "")
                      }
                    >
                      <label htmlFor="Email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="Email"
                        value={user.Email}
                        onChange={this.handleChange}
                      />
                      {submitted &&
                        !user.Email && (
                          <div className="help-block">Email is required</div>
                        )}
                    </div>
                    <div
                      className={
                        "form-group" +
                        (submitted && !user.username ? " has-error" : "")
                      }
                    >
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={user.username}
                        onChange={this.handleChange}
                      />
                      {submitted &&
                        !user.username && (
                          <div className="help-block">Username is required</div>
                        )}
                    </div>
                    <div
                      className={
                        "form-group" +
                        (submitted && !user.password ? " has-error" : "")
                      }
                    >
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={user.password}
                        onChange={this.handleChange}
                      />
                      {submitted &&
                        !user.password && (
                          <div className="help-block">Password is required</div>
                        )}
                    </div>

                    <div
                      className={
                        "form-group" +
                        (submitted && (!user.cpassword || passcheck)
                          ? " has-error"
                          : "")
                      }
                    >
                      <label htmlFor="password">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="cpassword"
                        value={user.cpassword}
                        onChange={this.handleChange}
                      />
                      {submitted &&
                        !user.cpassword && (
                          <div className="help-block">
                            Confirm Password is required
                          </div>
                        )}
                      {submitted &&
                        user.cpassword &&
                        passcheck && (
                          <div className="help-block">
                            Password not matching
                          </div>
                        )}
                    </div>

                    <div className="form-group looking-for-step">
                      <div className="button-group">
                        <label className="btn signup-objective-label signup-objective-label-left">
                          <input
                            className="signup-objective-radio-left"
                            id="lookingToHire"
                            name="looking_for"
                            value="Employer"
                            type="radio"
                            onClick={this.handleradio}
                          />{" "}
                          Hire
                        </label>
                        <label className="btn signup-objective-label signup-objective-label-right">
                          <input
                            className="signup-objective-radio-right"
                            id="lookingForWork"
                            name="looking_for"
                            value="Worker"
                            type="radio"
                            onClick={this.handleradio}
                          />{" "}
                          Work
                        </label>
                        {submitted &&
                          !usertype && (
                            <div className="help-block" id="roleblock">
                              Please select one Role
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="form-group" id="LoginButtonDiv">
                      <button className="btn btn-primary" id="LoginButton">
                        Register
                      </button>

                      <p id="smallLabel2">
                        By registering you confirm that you accept the Terms and
                        Conditions and Privacy Policy
                      </p>
                    </div>
                    <div id="smallLabeldiv">
                      <p id="smallLabel">
                        Already a Freelancer.com member?
                        <Link
                          to="/login"
                          className="btn btn-link"
                          id="linkHelper"
                        >
                          Log In
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { registering } = state.registration;
  const { alert } = state;
  return {
    registering,
    alert
  };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as RegisterPage };
