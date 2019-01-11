import axios from "axios";
import { LOGIN_SUCCESS } from "../Constants/UserConstants";
import { history } from "../Helpers/history";
import * as UserConstants from "../Constants/UserConstants";
import { func } from "prop-types";
var jwtDecode = require("jwt-decode");
export const userActions = {
  login,
  listProperty,
  uploadFile,
  decrementItem,
  incrementItem,
  getcurrentpropid,
  signup,
  ownersignup,
  searchProperty,
  setPropertyid,
  bookproperty
};

// function login(data) {
//   return dispatch => {
//     return axios
//       .post("http://localhost:3001/login", data)
//       .then(response => {
//         console.log("response is ", response.data);
//         dispatch(loginSuccess(response.data));
//       })
//       .catch(error => {
//         throw error;
//       });
//   };
// }
export function login(data) {
  console.log("inside login action ");
  return dispatch => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3001/login", data)
      .then(response => {
        console.log("response is ", response.data);
        var decoded = jwtDecode(response.data);
        var tid = decoded.user.type;
        var username = decoded.user._id;
        localStorage.setItem("userType", tid);
        localStorage.setItem("userId", username);
        dispatch(loginSuccess(response.data));
      })
      .catch(error => {
        console.log("login err", error);
        window.alert("Invalid credentials");
        throw error;
      });
  };
}

function loginSuccess(data) {
  return {
    //  type: LOGIN_SUCCESS,
    type: UserConstants.LOGIN_SUCCESS,
    payload: data
  };
}
function request(user) {
  return { type: "USERS_LOGIN_REQUEST", user };
}

function success(user) {
  return { type: "USERS_LOGIN_SUCCESS", user };
}

function failure(error) {
  return { type: "USERS_LOGIN_FAILURE", error };
}
function listProperty(data) {
  console.log("inside List Property action ");
  return dispatch => {
    // axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3001/list-property", data)
      .then(response => {
        console.log("response is ");
        console.log(response.data.message);
        dispatch(postPropertySuccess(response.data.message));
      })
      .catch(error => {
        throw error;
      });
  };
}

function uploadFile(uploadFiles) {
  console.log("inside upload File action ");
  return dispatch => {
    //axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3001/upload-files", uploadFiles)
      .then(response => {
        console.log("response is ", response.data);
        console.log(response.data.message);
        dispatch(uploadSuccess(response.data.message));
      })
      .catch(error => {
        throw error;
      });
  };
}
function uploadSuccess(message) {
  return {
    //  type: LOGIN_SUCCESS,
    type: UserConstants.UPLOAD_SUCCESS,
    payload: message
  };
}

function postPropertySuccess(message) {
  return {
    //  type: LOGIN_SUCCESS,
    type: UserConstants.LIST_PROPERTY_SUCCESS,
    payload: message
  };
}

function incrementItem(name) {
  return {
    type: UserConstants.INCREMENT_ITEM,
    name: name
  };
}
function decrementItem(name) {
  return {
    type: UserConstants.DECREMENT_ITEM,
    name: name
  };
}
function getcurrentpropid() {
  console.log("fetching current propid ");
  return dispatch => {
    // axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3001/getPropid")
      .then(response => {
        console.log("response is ", response.data);
        dispatch(setPropertyId(response.data.prop_id));
      })
      .catch(error => {
        throw error;
      });
  };
}
function setPropertyId(propid) {
  return {
    type: UserConstants.GET_LATEST_PROERTY_ID,
    propid: propid
  };
}

function signup(data) {
  console.log("inside traveller signup action ");
  return dispatch => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3001/traveller/signup", data)
      .then(response => {
        console.log("xresponse is ", response.data);
        var decoded = jwtDecode(response.data);
        var tid = decoded.user.type;
        var username = decoded.user._id;
        console.log("signup token username", username);
        localStorage.setItem("userType", tid);
        localStorage.setItem("userId", username);
        // localStorage.setItem("userId", response.data.user);
        dispatch(signupsuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

function signupsuccess(message) {
  return {
    type: UserConstants.TRAVELER_SIGNUP_SUCCESS,
    message: message
  };
}
function ownersignupsuccess(message) {
  return {
    type: UserConstants.OWNER_SIGNUP_SUCCESS,
    message: message
  };
}

function ownersignup(data) {
  console.log("inside owner signup action ", data);
  return dispatch => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3001/owner/signup", data)
      .then(response => {
        console.log("response is ", response.data);
        var decoded = jwtDecode(response.data);
        var tid = decoded.user.type;
        var username = decoded.user._id;
        localStorage.setItem("userType", tid);
        localStorage.setItem("userId", username);
        //  localStorage.setItem("userId", response.data.user);
        // username: localStorage.getItem("userId")
        dispatch(ownersignupsuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}
function searchProperty(data) {
  return {
    type: UserConstants.SEARCH_PROPERTY,
    data: data
  };
}

function setPropertyid(data) {
  return {
    type: UserConstants.SET_PROPERTY_ID,
    data: data
  };
}
function bookproperty(data) {
  console.log("inside traveller booking  action ");
  return dispatch => {
    // axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3001/book-property", data)
      .then(response => {
        console.log("response is ", response.data.message);
        window.alert(response.data.message);
        dispatch(bookpropertysuccess(response.data.message));
      })
      .catch(error => {
        throw error;
      });
  };
}
function bookpropertysuccess(message) {
  return {
    type: UserConstants.BOOK_PROPERTY_SUCCESS,
    message: message
  };
}

// function getPropertyDetails(data) {
//   console.log("inside owner signup action ");
//   return dispatch => {
//     //axios.defaults.withCredentials = true;
//     axios
//       .post("http://localhost:3001/places", data)
//       .then(response => {
//         console.log("response is ", response.data);
//         dispatch(fetchPropertyImages(response.data));
//       })
//       .catch(error => {
//         throw error;
//       });
//   };
// }
// function fetchPropertyImages(data){
//   var photos=[]
//   for (let i = 0; i < data.length; i++) {
//     const data = { id: data[i].prop_id };
//     console.log("inside", data[i].prop_id);

//     await axios
//       .post("http://localhost:3001/getPropertyImg", data)
//       .then(async response => {
//         console.log(JSON.stringify(response.data));
//         photos.push(response.data);
//         this.setState({
//           PropertyPhotos: photos
//         });
//         console.log("response imagee", JSON.stringify(photos));
//         console.log("photos.length", JSON.stringify(photos.length));
//         console.log(
//           "PropertyPhotos",
//           JSON.stringify(this.state.PropertyPhotos)
//         );
//       });
//   }
// }

// axios.post("http://localhost:3001/places", data).then(async response => {
//   console.log(JSON.stringify(response.data));

//   this.setState({
//     Properties: response.data
//   });
//   console.log("this.state.Properties.length", this.state.Properties.length);

//   var finalProperties = [];
//   this.state.Properties.forEach(property => {
//     this.state.PropertyPhotos.forEach(photo => {
//       //  console.log("this.state.Propertyyy", property);
//       //console.log("this.state.photoo", photo);
//       if (photo.propid === property.prop_id) {
//         property.photo = photo.img;

//         console.log("this.state.Propertyyy", JSON.stringify(property));
//         finalProperties.push(property);
//       }
//     });
//   });
//   this.setState({
//     Properties: finalProperties
//   });
// });

// function fetchPropertyDetailsSuccess(data){
//   return {
//     type: UserConstants.GET_PROPERTIES,
//     data: data
//   };
// }
