import React, { useState } from "react";
import { PractitionerList } from "./components/PractitionerList";
import "./styles/all.scss";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";
import { Dropdown, FlexboxGrid, Icon, Nav } from "rsuite";
import { AppHeader } from "@commure/components-core";
import logo from "./assets/logo-qs.png";

const smartClient = new SMARTClient(smartConfig);

function Team() {
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
      <Nav.Item href='/employee' >Employees</Nav.Item>
      <Nav.Item href='/skills'>Skills</Nav.Item>
      <Nav.Item href='/adjustments'>Adjustments</Nav.Item>
      <Dropdown active={true} title="About">
        <Dropdown.Item href='/company'>Company</Dropdown.Item>
        <Dropdown.Item href='/team'>Team</Dropdown.Item>
      </Dropdown>
    </Nav>} />
      <div>
        <FlexboxGrid justify='center'>
          <h1>
            BEST CAPSTONE 2020 [S21-17]
                </h1>
        </FlexboxGrid>
        <p>
          Team Members:
          <ol>
            <li>Swetha Angara</li>
            <li>Ariela Chomski</li>
            <li>Bracha 'Brooke' Getter</li>
            <li>Neha Nelson</li>
            <li>Param Patel</li>
          </ol>
        </p>
      </div>
    </>
  );
}

export default Team;