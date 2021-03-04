import { AppHeader } from "@commure/components-core";
import React, { useState } from "react";
import { Nav, Icon, Dropdown } from "rsuite";
import logo from "./assets/logo-qs.jpg";
function Home() {
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
      <Nav.Item href='/home' active={true} icon={<Icon icon="home" />}>Home</Nav.Item>
      <Nav.Item href='/schedule'>Schedule</Nav.Item>
      <Nav.Item href='/employee'>Employees</Nav.Item>
      <Nav.Item href='/skills'>Skills</Nav.Item>
      <Nav.Item href='/adjustments'>Adjustments</Nav.Item>
      <Dropdown title="About">
        <Dropdown.Item>Company</Dropdown.Item>
        <Dropdown.Item>Team</Dropdown.Item>
        <Dropdown.Item>Contact</Dropdown.Item>
      </Dropdown>
    </Nav>}/>
    <div className="hello-world-container">
      <p>Hello home!</p>
    </div>
    </>
  );
}

export default Home;
