import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import reducer from "./store/reducer";
import loginreducer from "./store/Reducers/loginreducer";
import postpropertyreducer from "./store/Reducers/postpropertyreducer";
import bookpropertyreducer from "./store/Reducers/bookpropertyreducer";
import profilereducer from "./store/Reducers/profilereducer";
import signupreducer from "./store/Reducers/signupreducer";
import promise from "redux-promise";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import registerServiceWorker from "./registerServiceWorker";
import { composeWithDevTools } from "redux-devtools-extension";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
const rootReducer = combineReducers({
  login: loginreducer,
  postproperty: postpropertyreducer,
  bookproperty: bookpropertyreducer,
  profile: profilereducer,
  signup: signupreducer
});

// apollo client setup
// const client = new ApolloClient({
//   uri: "http://localhost:8080/graphql"
// });

const loggerMiddleware = createLogger();
//const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, loggerMiddleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
