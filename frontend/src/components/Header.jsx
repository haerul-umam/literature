import { useContext } from "react"
import {Navbar, Container, Nav, Dropdown} from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import {AuthContext} from "../context/authContext"

export default function Header(props) {
    const [,dispatchUser] = useContext(AuthContext)
    const {pathname} = useLocation()
    const splitLocation = pathname.split("/")

    
    return (
        <Navbar variant="dark" expand="md">
            <Container>
                {props.show &&
                <>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar">
                    <Nav>
                        <Nav.Link to="/profile" as={Link} className={splitLocation[1] === "profile" ? "text-danger" : ""} style={{color:"#fff"}}>Profile</Nav.Link>
                        <Nav.Link to="/my-collections" as={Link} className={splitLocation[1] === "my-collections" ? "text-danger" : ""} style={{color:"#fff"}}>Collection</Nav.Link>
                        <Nav.Link to="/add-literatur" as={Link} className={splitLocation[1] === "add-literatur" ? "text-danger" : ""} style={{color:"#fff"}}>Add Literature</Nav.Link>
                        <Nav.Link to="/search" as={Link} className={splitLocation[1] === "search" ? "text-danger" : ""} style={{color:"#fff"}}>Search Literature</Nav.Link>
                        <Nav.Link onClick={() => {dispatchUser({type: "LOGOUT"})}} style={{color:"#fff"}}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </>
                }
                <Navbar.Brand >
                    <Link to="/">
                    <img src="/assets/icons/logo.png" height="30" alt="logo"/>
                    </Link>
                </Navbar.Brand>
                {props.admin &&
                    <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        <img src="/assets/icons/avatar.png" alt="" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <li>
                            <button className="dropdown-item" onClick={() => {dispatchUser({type: "LOGOUT"})}}>
                            <img src="/assets/icons/logout.png" alt="logout" className="me-2"/> Logout
                            </button>
                        </li>
                    </Dropdown.Menu>
                    </Dropdown>
                }
              
            </Container>
        </Navbar>
    )
}
