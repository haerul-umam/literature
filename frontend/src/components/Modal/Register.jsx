import { Modal, Form, Button } from "react-bootstrap"
import { useState, useContext } from "react"
import { API, setAuthToken } from "../../config/api"
import { useHistory } from "react-router-dom"
import { AuthContext } from "../../context/authContext"
import style from "./Auth.module.css"

export default function Register({modal}) {
    let navigate = useHistory()
    const [form, setForm] = useState({})
    const [msg, setMsg] = useState(null)
    const [,dispatchUser] = useContext(AuthContext)


    const handleInput = (e) => {
        setForm(prev => ({
            ...prev,[e.target.name] : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        try{
            e.preventDefault()
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
    
            const data = JSON.stringify(form)
            const response = await API.post("register", data, config)
           
            if (response.status === 200){
                modal.closeModal()

                setAuthToken(response.data.register.token)

                await dispatchUser({
                    type: "LOGIN",
                    payload: response.data.register
                })
                navigate.push("/")
            }
        }catch(e){
            console.log(e)
            setMsg(e.response.data["message"])
        }
    }

    const showLogin = () => {
        modal.setModal({ type: "register", payload: false });
        modal.setModal({ type: "login", payload: true });
    };

    const closeModal = () => {
        modal.closeModal()
        setMsg(null)
    }
    return (
        <Modal show={modal.show} dialogClassName={style.ModalSize} onHide={closeModal} centered>
            <Modal.Body className={style.ModalBody}>
                <h2 className="fw-bold">Register</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicFullName">
                        <Form.Control type="text" placeholder="Full Name" name="fullName"  onChange={handleInput} className={style.Input} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" name="email" placeholder="Email" className={style.Input} onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" name="password" className={style.Input} placeholder="password" onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Control type="text" name="phone" className={style.Input} placeholder="Phone" onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select name="gender" defaultValue={"DEFAULT"} className={style.Input} onChange={handleInput}>
                            <option value="DEFAULT" disabled>Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Control type="text" name="address" placeholder="Address" className={style.Input} onChange={handleInput} required/>
                    </Form.Group>
                    <div className="text-danger fw-bold text-center my-1">{msg && msg}</div>
                    <Button variant="danger" type="submit" className="text-light mb-3 fw-bold w-100">Submit</Button>
                    <p className="text-center m-0">Already a member ? klik
                    <button className={`${style.Button} text-danger`} onClick={showLogin}>Login</button>
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
