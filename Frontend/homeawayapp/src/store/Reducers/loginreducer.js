import * as UserConstants from "../../../src/Constants/UserConstants";

const initialState = {
  username: "",
  authFlag: false
};

const reducer = (state = initialState, action) => {
  console.log("action payload for login", action.payload);
  if (action.type === UserConstants.LOGIN_SUCCESS) {
    return {
      ...state,
      authFlag: true,
      username: action.payload
    };
  }
  return state;
};
export default reducer;
