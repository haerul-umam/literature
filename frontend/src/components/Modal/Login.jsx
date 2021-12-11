import { Modal, Form, Button } from "react-bootstrap"
import { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import { API, setAuthToken } from "../../config/api"
import { AuthContext } from "../../context/authContext"
import style from "./Auth.module.css"


export default function Login({modal}) {
    let navigate = useHistory()
    const [form, setForm] = useState({})
    const [,dispatchUser] = useContext(AuthContext)
    const [msg, setMsg] = useState(null)


    const handleInput = (e) => {
        setForm(prev => ({
            ...prev, [e.target.name] : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        try{
            e.preventDefault()
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }

            const body = JSON.stringify(form)
            const response = await API.post("/login", body, config)

            if (response.status === 200){
                modal.closeModal()

                setAuthToken(response.data.login.token)

                await dispatchUser({
                    type: "LOGIN",
                    payload: response.data.login
                })
                if (response.data.login.role === "admin"){
                    navigate.push("/book-verify")  
                }else{
                    navigate.push("/")
                }
            }

        }catch(e){
            setMsg(e.response.data["message"])
            console.log(e)
        }
    }

    const showRegister = () => {
        modal.setModal({ type: "register", payload: true });
        modal.setModal({ type: "login", payload: false });
    };

    const closeModal = () => {
        modal.closeModal()
        setMsg(null)
    }

    return (
        <Modal show={modal.show} dialogClassName={style.ModalSize} onHide={closeModal} centered>
            <Modal.Body className={style.ModalBody}>
                <h2 className="fw-bold">Sign In</h2>
                <Form onSubmit={handleSubmit} >
                    <Form.Group className="mb-3">
                        <Form.Control type="email" name="email" placeholder="Email" onInput={handleInput} className={style.Input} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" name="password" onChange={handleInput} className={style.Input} required/>
                    </Form.Group>
                    <div className="text-danger fw-bold text-center my-1">{msg && msg}</div>
                    <Button variant="danger" type="submit" className="text-light mb-3 fw-bold w-100 mt-1">Submit</Button>
                    <p className="text-center m-0">Don't have an account ? klik
                    <button className={`${style.Button} text-danger`} onClick={showRegister}>Register</button>
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
