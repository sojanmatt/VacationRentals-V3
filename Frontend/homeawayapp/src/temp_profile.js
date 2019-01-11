import React from 'react';
import { connect } from 'react-redux';
//import './profileTest.css';
import staticImg from '../Images/Freelancer Icon Short.png';
import {userActions} from "../Actions";
import ContentEditable from 'react-contenteditable';
import $ from "jquery";
import {RESTService} from "../API";

//import Modal from 'react-modal';

class MyProfile extends React.Component {

    constructor(props) {
        super(props);
        let img = "";
        let imgFile = "";
        // Not needed. Handled at App.js
        // TODO: this.props.dispatch(userActions.logout());

        this.state = {
            isEdit: false,
            aboutMe: this.props.user.about_me,
            aboutMeSaved: this.props.user.about_me,
            aboutMeEdit: false,
            summary: this.props.user.summary,
            summarySaved: this.props.user.summary,
            summaryEdit: false,
            name: this.props.user.name,
            nameSaved: this.props.user.name,
            nameEdit: false,
            phone: this.props.user.phone,
            phoneSaved: this.props.user.phone,
            phoneEdit: false,
            profileImg: "",
            skills : this.props.user.skills,
            skillsSaved : this.props.user.skills,
            modalIsOpen: false,
        };
    }
    componentWillMount(){
        console.log("###Fetch Profile Image in componentWillMount:");

        const { dispatch } = this.props;
        dispatch(userActions.getByUserName());
        const { user } = this.props;
        this.getProfileFromServer(user.username);
    }
    componentDidMount() {
        var self = this;

        $(document).on('change', '.btn-file :file', function() {
            var input = $(this),
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [label]);
        });

        $('.btn-file :file').on('fileselect', function(event, label) {

            var input = $(this).parents('.input-group').find(':text'),
                log = label;
            if( input.length ) {
                input.val(log);
            } else {
                if( log ) alert(log);
            }
        });

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                self.imgFile = input.files[0];
                reader.onload = function (e) {
                    self.img = e.target.result;
                    $('#img-upload').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        $("#imgInp").change(function(){
            readURL(this);
        });
    }

    handleChangeImg = (event) => {
        this.setState({
            profileImg : this.img
        });
        RESTService.sendFile(this.imgFile);
        const { user } = this.props;
        this.getProfileFromServer(user.username);
    };

    handleChangePhone = (event) => {

        this.setState({
            phone: event.target.value
        });
    };

    handleChangeName = (event) => {

        this.setState({
            name: event.target.value
        });
    };

    handleSummaryChange = (event) => {

        this.setState({
            summary: event.target.value
        });
    };

    handleChangeAboutMe = (event) => {

        this.setState({
            aboutMe: event.target.value
        });
    };

    toggleViewEditBtn = (event) => {
        this.setState({
            isEdit: !this.state.isEdit,
        });
    };

    toggleEditPhone = (event) => {
        this.setState({
            phoneEdit: !this.state.phoneEdit
        });
    };

    toggleEditName = (event) => {
        this.setState({
            nameEdit: !this.state.nameEdit
        });
    };

    toggleEditAboutMe = (event) => {
        this.setState({
            aboutMeEdit: !this.state.aboutMeEdit
        });
    };

    toggleEditSummary = (event) => {
        this.setState({
            summaryEdit: !this.state.summaryEdit
        });
    };

    savePhone = (event) => {
        this.setState({
            phoneSaved: this.state.phone,
            phoneEdit: false
        });
        RESTService.updatePhone(this.state.phone);
    };

    saveName = (event) => {
        this.setState({
            nameSaved: this.state.name,
            nameEdit: false
        });
        RESTService.updateName(this.state.name);
    };

    saveSummary = (event) => {
        this.setState({
            summarySaved: this.state.summary,
            summaryEdit: false
        });
        RESTService.updateSummary(this.state.summary);
    };

    saveAboutMe = (event) => {
        this.setState({
            aboutMeSaved: this.state.aboutMe,
            aboutMeEdit: false
        });
        RESTService.updateAboutMe(this.state.aboutMe);
    };

    getProfileFromServer(username){
        RESTService.getProfileImage(username).then((res) => {
            console.log("###inside response:");
            // var base64 = new Buffer(res.body, 'binary').toString('base64');
            // console.log(base64);
            // console.log(res);
            // console.log(res.img);
            this.setState({profileImg : res.img})
        });
    }

    saveSkills = (event) => {
        event.preventDefault();
        console.log('###inside saveSkills');
        this.setState({
            skillsSaved: this.refs.skills.value
        });
        RESTService.updateSkills(this.refs.skills.value);
    };

    logout = (event) => {
        const {dispatch} = this.props;
        dispatch(userActions.logout());
    };

    render() {
        const { user } = this.props;
        const { isEdit, aboutMeEdit, summaryEdit, profileImg, skillsSaved, nameEdit, phoneEdit } = this.state;
        console.log("##state values");
        // console.log(profileImg);
        var imgSrc = profileImg ? 'data:image/jpeg;base64,' + profileImg : staticImg;
        console.log("###profile-image from state");

        return (
            <div className="main-content">

                <div className="profile-info">
                    <div className="container-info">
                        <div className="grid-info">
                            <div className="grid-col">
                                <div className="row profile-info-card" id="shadowpanel">
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-avatar">
                                        <div className="profile-avatar-image"  id="shadowpanel">
                                            <div className="profile-avatar-image-uploader">
                                                <div className="profile-avatar-image-wrapper">
                                                    <div className="profile-avatar-image-done">
                                                        <img className="avatar-image" src={imgSrc} alt="Profile"/>
                                                        <a className="picture-upload-trigger" data-toggle="modal" data-target="#myModal" href="#">
                                                            <span className="picture-upload-trigger-inner fa fa-camera">
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>@{ user.username }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>{ user.email }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone">
                                            <div>
                                                {/*{ user.phone }*/}
                                                {   !isEdit &&
                                                <div className="edit-widget">
                                                    {this.state.phoneSaved}
                                                </div>
                                                }
                                                {   isEdit && !phoneEdit &&
                                                <div className="profile-about-description edit-widget">
                                                    {this.state.phoneSaved}
                                                    <button className="edit-widget-trigger"
                                                            onClick={this.toggleEditPhone}>
                                                        <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                    </button>
                                                </div>
                                                }
                                                {   isEdit && phoneEdit &&
                                                <div className="profile-phone-div">
                                                    <input defaultValue={this.state.phone}
                                                                     onChange={this.handleChangePhone}
                                                                     className="profile-phone-text"
                                                                     placeholder="Phone Number"
                                                    />
                                                </div>
                                                }
                                                {   isEdit && phoneEdit &&
                                                <button className="btn btn-small btn-info edit-widget-btn"
                                                        disabled={!this.state.phone}
                                                        onClick={this.savePhone}>
                                                    Save
                                                </button>
                                                }
                                                {   isEdit && phoneEdit &&
                                                <button className="btn-small btn edit-widget-btn"
                                                        onClick={this.toggleEditPhone}>
                                                    Cancel
                                                </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 profile-about">
                                        <div>
                                            <div className="profile-about-name-wrapper">
                                                <h1 className="profile-intro-username">
                                                    {   !isEdit &&
                                                    <div className="edit-widget">
                                                        {this.state.nameSaved}
                                                    </div>
                                                    }
                                                    {   isEdit && !nameEdit &&
                                                    <div className="profile-about-description edit-widget"
                                                         id="about-me">
                                                        {this.state.nameSaved}
                                                        <button className="edit-widget-trigger"
                                                                onClick={this.toggleEditName}>
                                                            <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                        </button>
                                                    </div>
                                                    }
                                                    {   isEdit && nameEdit &&
                                                    <input defaultValue={this.state.name}
                                                                     onChange={this.handleChangeName}
                                                                     className="profile-name-text"
                                                                     placeholder="Full Name"
                                                    />
                                                    }
                                                    {   isEdit && nameEdit &&
                                                    <button className="btn btn-small btn-info edit-widget-btn"
                                                            disabled={!this.state.name}
                                                            onClick={this.saveName}>
                                                        Save
                                                    </button>
                                                    }
                                                    {   isEdit && nameEdit &&
                                                    <button className="btn-small btn edit-widget-btn"
                                                            onClick={this.toggleEditName}>
                                                        Cancel
                                                    </button>
                                                    }
                                                </h1>
                                            </div>
                                            <div className="profile-user-byline">
                                                {!isEdit &&
                                                <div className="edit-widget">
                                                    {this.state.summarySaved}
                                                </div>
                                                }
                                                {   isEdit && !summaryEdit &&
                                                <div className="profile-about-description edit-widget">
                                                    {this.state.summarySaved}
                                                    <button className="edit-widget-trigger"
                                                            onClick={this.toggleEditSummary}>
                                                        <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                    </button>
                                                </div>
                                                }
                                                {isEdit && summaryEdit &&
                                                <input defaultValue={this.state.summary}
                                                                 onChange={this.handleSummaryChange}
                                                                 className="profile-summary-textarea"
                                                                 placeholder="Professional headline - e.g. Graphic designer"
                                                />
                                                }
                                                {isEdit && summaryEdit &&
                                                <button className="btn btn-small btn-info edit-widget-btn"
                                                        disabled={!this.state.summary}
                                                        onClick={this.saveSummary}>
                                                    Save
                                                </button>
                                                }
                                                {isEdit && summaryEdit &&
                                                <button className="btn-small btn edit-widget-btn"
                                                        onClick={this.toggleEditSummary}>
                                                    Cancel
                                                </button>
                                                }
                                            </div>
                                            <div className="profile-about-wrapper">
                                                {!isEdit &&
                                                <div className="profile-about-description edit-widget"
                                                     id="about-me-display">
                                                    {this.state.aboutMeSaved}
                                                </div>
                                                }
                                                {isEdit && !aboutMeEdit &&
                                                <div className="profile-about-description edit-widget"
                                                     id="about-me">
                                                    {this.state.aboutMeSaved}
                                                    <button className="edit-widget-trigger"
                                                            onClick={this.toggleEditAboutMe}
                                                    >
                                                        <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                    </button>
                                                </div>
                                                }
                                                {isEdit && aboutMeEdit &&
                                                <input defaultValue={this.state.aboutMe}
                                                                 onChange={this.handleChangeAboutMe}
                                                                 className="profile-about-textarea"
                                                                 placeholder="Tell us a bit about yourself"
                                                                 name="aboutMe"/>
                                                }
                                                {isEdit && aboutMeEdit &&
                                                <button className="btn btn-small btn-info edit-widget-btn"
                                                        disabled={!this.state.aboutMe}
                                                        onClick={this.saveAboutMe}>
                                                    Save
                                                </button>
                                                }
                                                {isEdit && aboutMeEdit &&
                                                <button className="btn-small btn edit-widget-btn"
                                                        onClick={this.toggleEditAboutMe}>
                                                    Cancel
                                                </button>
                                                }
                                                <p>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-stats">
                                        { !isEdit &&
                                        <button id="editProfile" type="submit"
                                                className="form-control tn btn-info btn-large btn-submit btn-edit-account"
                                                onClick={this.toggleViewEditBtn}>
                                            <span className="Button-icon fa fa-pencil"/>
                                            Edit Profile
                                        </button>
                                        }

                                        { isEdit &&
                                        <button id="editProfile" type="submit"
                                                className="form-control tn btn-info btn-large btn-submit btn-edit-account"
                                                onClick={this.toggleViewEditBtn}>
                                            <span className="Button-icon fa fa-user"/>
                                            View Profile
                                        </button>
                                        }
                                        <h2 className="profile-stats-skills">
                                            Top Skills

                                            {   isEdit &&
                                            <button className="btn btn-small btn-info edit-widget-btn inline-edit-add-bt section-button float-right"
                                                    data-toggle="modal" data-target="#skillsModal">
                                                + Skill
                                            </button>
                                            }
                                        </h2>

                                        {
                                            <div className="profile-skills edit-widget"
                                                 id="about-me-display">
                                                {this.state.skillsSaved}
                                            </div>

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Upload image</h4>
                            </div>
                            <div className="modal-body">
                                <div className="input-group">
                                    <span className="input-group-btn">
                                        <span className="btn btn-secondary btn-file">
                                            Browse… <input type="file" id="imgInp" />
                                        </span>
                                    </span>
                                    <input type="text" className="form-control" readOnly/>
                                </div>
                                <img id='img-upload' alt="Upload"/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleChangeImg}>Save</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="skillsModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form ref = "projectForm">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title">Add Skills</h4>
                                </div>
                                <div className="modal-body">
                                    <textarea className="profile-summary-textarea" ref="skills"
                                              placeholder="Enter your top skills seperated by comma"
                                              defaultValue={this.state.skillsSaved}
                                              name="skillsText">

                                    </textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-small edit-widget-btn btn-primary" data-dismiss="modal" onClick={this.saveSkills}>Save</button>
                                    <button type="button" className="btn btn-small edit-widget-btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { user } = state.authentication;
    const { profile } = state;
    return {
        user,
        profile
    };
}



const connectedMyProfile = connect(mapStateToProps)(MyProfile);
export { connectedMyProfile as MyProfile };