import * as UserConstants from "../../../src/Constants/UserConstants";

const initialState = {
  isTravelerSignedUp: false,
  isOwnerSignedUp: false,
  username: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UserConstants.TRAVELER_SIGNUP_SUCCESS:
      return {
        ...state,
        isTravelerSignedUp: true,
        isOwnerSignedUp: false
      };
    case UserConstants.OWNER_SIGNUP_SUCCESS:
      return {
        ...state,
        isOwnerSignedUp: true,
        isTravelerSignedUp: false,
        username: action.message
      };
  }
  return state;
};
export default reducer;
