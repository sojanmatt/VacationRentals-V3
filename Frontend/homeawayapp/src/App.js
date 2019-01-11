import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <div>
            {/* App Component Has a Child Component called Main*/}
            <Main />
          </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
