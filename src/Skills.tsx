import React, { useState } from "react";
import { SkillsList } from "./components/SkillsList";
import logo from "./assets/logo-qs.png";
import "./styles/all.scss";
import { CommureSmartApp } from "@commure/components-data";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";
import { AppHeader } from "@commure/components-core";
import { Nav, Icon, Dropdown } from "rsuite";

const smartClient = new SMARTClient(smartConfig);

function Skills() {
  const [isOpen, setOpen] = useState(false);
  const toggleCollapse = () => {
    setOpen(!isOpen);
  };
  return (
    <><AppHeader showFullUserName={true} logo={<Nav>
      <img src={logo} alt="Quick Shift Logo" width="40" height="40" />
      <Nav.Item href='/'>
        <h6>Quick Shift</h6>
      </Nav.Item>
      <Nav.Item href='/home' icon={<Icon icon="home" />}>Home</Nav.Item>
      <Nav.Item href='/schedule'>Schedule</Nav.Item>
      <Nav.Item href='/employee'>Employees</Nav.Item>
      <Nav.Item href='/skills' active={true}>Skills</Nav.Item>
      <Nav.Item href='/adjustments'>Adjustments</Nav.Item>
      <Dropdown title="About">
        <Dropdown.Item href='/company'>Company</Dropdown.Item>
        <Dropdown.Item href='/team'>Team</Dropdown.Item>
      </Dropdown>
    </Nav>} />
      <CommureSmartApp client={smartClient}>

        <div className="app-container">
          <SkillsList />
        </div>
      </CommureSmartApp>
    </>
  );
}

export default Skills;
