import { CommureSmartApp } from "@commure/components-data";
import SMARTClient from "@commure/smart-core";
import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { smartConfig } from "./config";
import Home from "./Home";
import Employee from "./Employee";
import Schedule from "./Schedule";
import Skills from "./Skills";
import "./styles/all.scss";
import Adjustments from "./Adjustments";
import Team from "./Team";
import Company from "./Company";

const smartClient = new SMARTClient(smartConfig);

function App() {
  return (
    <CommureSmartApp client={smartClient}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/employee" component={Employee} />
          <Route exact path="/skills" component={Skills} />
          <Route exact path="/schedule">
            <Schedule />
          </Route>
          <Route exact path="/adjustments">
            <Adjustments />
          </Route>
          <Route exact path="/team" component={Team} />
          <Route exact path="/company" component={Company} />
        </Switch>
      </Router>
    </CommureSmartApp>
  );
}

export default App;