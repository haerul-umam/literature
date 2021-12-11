import {Container, Row, Col, Button, Image} from "react-bootstrap"
import Header from "../components/Header"
import Login from "../components/Modal/Login"
import Register from "../components/Modal/Register"
import {ModalContext} from "../context/modalContext"
import { useContext } from "react"


import style from "./css/Landing.module.css"

export default function Landing() {
    const [modal, setModal] = useContext(ModalContext)

    const showLogin = () => {
        setModal({ type: "login", payload: true });
    };

    const showRegister = () => {
        setModal({ type: "register", payload: true });
    };

    const closeModal = () => {
        setModal({ type: "close" });
    };

    return (
        <>
            <Header show={false}/>
            <Login modal={{show:modal.loginShow, closeModal, setModal}} />
            <Register modal={{show:modal.registerShow, closeModal, setModal}} />
            <Container>
                <Row className="d-flex align-items-center">
                    <Col md={5} >
                        <h1 className={style.Title}>Source <i>Of</i> intelligence</h1>
                        <p className={style.Subtitle}>Sign-up and receive unlimited access to all of your literature - share your literature.</p>
                        <div className="w-100 d-flex justify-content-between">
                            <Button onClick={showRegister} variant="danger" style={{width:"45%"}}>Sign Up</Button>
                            <Button onClick={showLogin} variant="light" style={{width:"45%"}}>Sign In</Button>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <Image src="assets/images/g12.png" width="500" alt="logo" fluid/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
