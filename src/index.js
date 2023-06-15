import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./app/store";

import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
console.log(domain);
ReactDOM.render(
  <Router>
    <Provider store={store}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}>
        <App />
      </Auth0Provider>
    </Provider>
  </Router>,
  document.getElementById("root")
);
