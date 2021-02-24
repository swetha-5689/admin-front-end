import { CommureSmartApp } from "@commure/components-data";
import SMARTClient from "@commure/smart-core";
import React from "react";
import "./App.css";
import AppHeader from "./NavbarPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { smartConfig } from "./config";
import Home from "./Home";
import Employee from "./Employee";
import Schedule from "./Schedule";

const smartClient = new SMARTClient(smartConfig);

function App() {
  return (
    <CommureSmartApp client={smartClient}>
      <Router>
        <AppHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/employee" component={Employee} />
          <Route exact path="/schedule">
            <Schedule />
          </Route>
        </Switch>
      </Router>
    </CommureSmartApp>
  );
}

export default App;
