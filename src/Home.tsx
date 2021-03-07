import { AppHeader } from "@commure/components-core";
import React, { useState } from "react";
import { Nav, Icon, Dropdown, RadioGroup, Carousel, Radio, Divider} from "rsuite";
import logo from "./assets/logo-qs.png";
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
    <div className="custom-slider">
    <Carousel autoplay className="custom-slider">
      <img
        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1"
        height="250"
      />
      <img
        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=2"
        height="250"
      />
      <img
        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=3"
        height="250"
      />
      <img
        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=4"
        height="250"
      />
      <img
        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=5"
        height="250"
      />
    </Carousel> 
    </div>
    </>
  );
}

export default Home;
