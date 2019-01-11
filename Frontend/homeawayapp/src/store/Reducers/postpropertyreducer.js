import * as UserConstants from "../../../src/Constants/UserConstants";
import moment from "moment";
const initialState = {
  authFlag: false,
  isListed: false,
  currentPropertyid: "",
  propertyid: "",
  isUploaded: false,
  uploadfilemessage: "",
  postPropertymessage: "",
  propertyDetails: {
    Bed: 3,
    Bath: 2,
    country: "",
    address: "",
    unit: "",
    city: "",
    state1: "",
    zip: "",

    headline: "",
    desc: "",
    type: "",
    capacity: "",

    currency: "",
    rate: "",
    minstay: ""
  },
  photos: [],
  fromDate: moment(),
  toDate: moment()
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UserConstants.LIST_PROPERTY:
      return {
        ...state,
        propertyDetails: {
          ...state.propertyDetails,
          [action.propertyfeature]: [state.propertyDetails.propertyfeature]
        }
      };
    case UserConstants.SUBMIT_PROPERTY:
      return {
        ...state,
        propertyDetails: {
          ...state.propertyDetails,
          [action.propertyfeature]: [state.propertyDetails.propertyfeature]
        }
      };
    case UserConstants.INCREMENT_ITEM:
      return {
        ...state,
        propertyDetails: {
          ...state.propertyDetails,
          [action.name]: state.propertyDetails[action.name] + 1
        }
      };

    case UserConstants.DECREMENT_ITEM:
      return {
        ...state,
        propertyDetails: {
          ...state.propertyDetails,
          [action.name]: state.propertyDetails[action.name] - 1
        }
      };
    case UserConstants.UPLOAD_SUCCESS:
      return {
        ...state,
        isUploaded: true,
        uploadfilemessage: action.message
      };
    case UserConstants.LIST_PROPERTY_SUCCESS:
      return {
        ...state,
        isListed: true,
        postPropertymessage: action.message
      };
    case UserConstants.GET_LATEST_PROERTY_ID:
      return {
        ...state,
        propertyid: action.propid,
        postPropertymessage: action.message
      };
  }

  return state;
};
export default reducer;
