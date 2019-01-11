import * as UserConstants from "../../../src/Constants/UserConstants";

const initialState = {
  isUpdated: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UserConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isUpdated: true
      };
  }
  return state;
};
export default reducer;
