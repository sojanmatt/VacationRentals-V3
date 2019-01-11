import * as UserConstants from "../../../src/Constants/UserConstants";

const initialState = {
  searchdata: {
    location: "",
    fromDate: "",
    toDate: "",

    adults: "",
    kids: ""
  },
  isBooked: false,
  isSearch: false,
  isNewSearch: true,
  Properties: [],
  currentPropID: "",
  displaylist: true,
  PropertyPhotos: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UserConstants.SEARCH_PROPERTY:
      console.log("isnside search property action", action.data);
      return {
        ...state,
        searchdata: Object.assign({}, state.searchdata, action.data),
        isSearch: true
      };
    case UserConstants.SET_PROPERTY_ID:
      console.log("isnside set property id action", action.data);
      return {
        ...state,
        currentPropID: action.data.currentPropID,
        displaylist: false
        // searchdata: Object.assign({}, state.searchdata, action.data),
      };
    case UserConstants.BOOK_PROPERTY_SUCCESS:
      console.log("isnside  BOOK_PROPERTY_SUCCESS", action.message);
      return {
        ...state,

        isBooked: true,
        isSearch: false
        // searchdata: Object.assign({}, state.searchdata, action.data),
      };
  }
  return state;
};
export default reducer;
