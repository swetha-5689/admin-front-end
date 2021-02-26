import React from "react";
import { PractitionerList } from "./components/PractitionerList";

import "./styles/all.scss";
import { CommureSmartApp } from "@commure/components-data";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";

const smartClient = new SMARTClient(smartConfig);

function Employee() {
  return (
    <CommureSmartApp client={smartClient}>
      
      <div className="app-container">
        <PractitionerList />
      </div>
    </CommureSmartApp>
  );
}

export default Employee;