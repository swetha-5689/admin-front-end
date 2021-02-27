import React from "react";
import { SkillsList } from "./components/SkillsList";

import "./styles/all.scss";
import { CommureSmartApp } from "@commure/components-data";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";

const smartClient = new SMARTClient(smartConfig);

function Skills() {
  return (
    <CommureSmartApp client={smartClient}>
      
      <div className="app-container">
        <SkillsList />
      </div>
    </CommureSmartApp>
  );
}

export default Skills;
