import React, { useState } from "react";
import { PractitionerList } from "./components/PractitionerList";
import "./styles/all.scss";
import SMARTClient from "@commure/smart-core";
import { smartConfig } from "./config";
import { Dropdown, FlexboxGrid, Icon, Nav } from "rsuite";
import { AppHeader } from "@commure/components-core";
import logo from "./assets/logo-qs.png";

const smartClient = new SMARTClient(smartConfig);

function Company() {
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
                        COMMURE
                </h1>
                </FlexboxGrid>
                <p>
                    <ol>
                        <h5><strong><li>Commure is building a system to accelerate healthcare software innovation.</li> </strong></h5>We believe that better software for doctors, nurses and patients - and ultimately for the healthcare system as a whole - will come from responsibly connecting the top minds in technology, medicine and design.
                <h5><strong><li>Commure is a partner for responsible innovation.</li></strong></h5>Commure was not built in a vacuum. From the very beginning, we have partnered with forward-leaning health leaders whose systems collectively serve over 30 million lives each year to make sure we earn their trust and fully understand what goes into achieving their goals of delivering safe, quality care. Commure is focused on enabling responsible innovation — not disruption.
                <h5><strong><li>Commure is built by doctors and developers for doctors and developers.</li></strong></h5>“We built this platform to support the work of software engineers and teams who are looking to move the needle in healthcare. We built it for doctors who code and who are intimately acquainted with the challenges their profession faces in the day to day. And we built it for the established vendors who want to move technology forward and embrace those that will bring a fresh point of view to an otherwise staid industry," said Hemant Taneja, Chairman and co-founder of Commure, and Managing Director of General Catalyst.
                </ol>
                </p>
            </div>
        </>
    );
}

export default Company;