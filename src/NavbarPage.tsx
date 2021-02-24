import React, { Component } from "react";
import logo from "./assets/logo-qs.jpg";
import { Dropdown, Icon, Nav, Navbar } from "rsuite";
import { Link } from 'react-router-dom';


class NavbarPage extends Component {
  state = {
    isOpen: false,
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <img src={logo} alt="Quick Shift Logo" width="55" height="55" />
        </Navbar.Header>
        <Navbar.Body>
          <Nav>
            <Nav.Item href='/'>
              <h6>Quick Shift</h6>
            </Nav.Item>
            <Nav.Item href='/home' icon={<Icon icon="home" />}>Home</Nav.Item>
            <Nav.Item href='/schedule'>Schedule</Nav.Item>
            <Nav.Item href='/employee'>Employees</Nav.Item>
            <Nav.Item>Skills</Nav.Item>
            <Nav.Item>Adjustments</Nav.Item>
            <Dropdown title="About">
              <Dropdown.Item>Company</Dropdown.Item>
              <Dropdown.Item>Team</Dropdown.Item>
              <Dropdown.Item>Contact</Dropdown.Item>
            </Dropdown>
          </Nav>
          <Nav pullRight>
            <Nav.Item icon={<Icon icon="avatar" />}>Login</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    );
  }
}

export default NavbarPage;
