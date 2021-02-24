import { CommureSmartApp } from "@commure/components-data";
import SMARTClient from "@commure/smart-core";
import React from "react";
import "./App.css";
import AppHeader from "./NavbarPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { smartConfig } from "./config";
import Home from "./Home";
import Employee from "./Employee";

const smartClient = new SMARTClient(smartConfig);

function App() {
  return (
    <CommureSmartApp client={smartClient}>
      <Router>
        <AppHeader />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/employee" component={Employee} />
        </Switch>
      </Router>
    </CommureSmartApp>
  );
}

export default App;
