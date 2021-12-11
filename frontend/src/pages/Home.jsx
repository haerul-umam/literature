import { useState } from "react"
import { useHistory } from "react-router-dom"
import {Container, Button} from "react-bootstrap"
import Header from "../components/Header"
import style from "./css/Search.module.css"

export default function Landing() {
    const [text, setText] = useState("")  // text search
    let navigate = useHistory()

    const searching = () => {
        if(text) {
            navigate.push(`/search?q=${text}`)
        }
    }
    return (
        <>
            <Header show={true}/>
            <Container className="d-flex flex-column my-auto">
                <div className="d-flex flex-column align-items-center">
                    <img src="assets/icons/logo.png" alt="logo" className="w-50 mb-5"/>
                    <div className="d-flex w-75">
                        <input type="text" className={`me-2 w-100 ${style.Input}`} onChange={(e) => {setText(e.target.value)}} placeholder="Search for literature"/>
                        <Button variant="danger" onClick={searching}><i className="fas fa-search"></i></Button>
                    </div>
                </div>
            </Container>
        </>
    )
}
