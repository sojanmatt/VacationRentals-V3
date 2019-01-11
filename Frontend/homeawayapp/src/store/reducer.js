import { LOGIN_SUCCESS } from "../Constants/UserConstants";
const initialState = {
  authFlag: false
};

const reducer = (state = initialState, action) => {
  if (action.type === LOGIN_SUCCESS) {
    return {
      authFlag: true
    };
  }
  return state;
};
export default reducer;
