import React, { Component } from "react";
import logo from "./assets/logo-qs.jpg";
import { Dropdown, Icon, Nav } from "rsuite";
import { AppHeader } from "@commure/components-core";


class NavbarPage extends Component {
  state = {
    isOpen: false,
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <><AppHeader showFullUserName={true} logo={<Nav>
        <img src={logo} alt="Quick Shift Logo" width="40" height="40" />
        <Nav.Item href='/'>
          <h6>Quick Shift</h6>
        </Nav.Item>
        <Nav.Item href='/home' icon={<Icon icon="home" />}>Home</Nav.Item>
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
        </>
    );
  }
}

export default NavbarPage;
