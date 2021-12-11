
import {Container, Button, Modal, Form, FloatingLabel, Alert} from "react-bootstrap"
import { API } from "../../config/api"
import style from "./Auth.module.css"
import { useState,useRef, useEffect } from "react"
import { toast } from 'react-toastify';

export default function ModalEdit({show, close, data, profile}) {
    const [form, setForm] = useState({})
    const inputPdf = useRef(null)
    const [msg, setMsg] = useState({})

    const buttonPdf = (e) => {
        e.preventDefault()
        inputPdf.current.click()
    }

    const getMessage = async () =>{
        try{
            const response = await API.get("/literatur/cancel/" + data.id)
            setMsg(response.data.cancel)
        }catch(e){
            console.log(e)
        }
    }

    const closeModal = () => {
        close(false)
        setForm({})
    }

    const handleChange = (e) => {
        try{
            setForm(prev => ({
                ...prev, [e.target.name] : e.target.type === "file" ? e.target.files[0] : e.target.value
            }))
        }catch(e){
            console.log(e)
        }
    }

    const handleSubmit = async (e) => {
        try{
            e.preventDefault()

            const config = {
                headers : {"Content-type": "multipart/form-data"}
            }
            const formData = new FormData()
            for (let prop in form){
                formData.set(prop, form[prop])
            }

            const response = await API.put("/user/literatur/"+data.id, formData, config)
            if (response.status === 200) {
                toast.success(`${response.data.message}`)
                profile()
            }
        }catch(e){
            toast.error(`${e.response.data.message}`)
            console.log(e)
        }
    }

    useEffect(() => {
        getMessage()
        return () => {
            setMsg({})
        }
        //eslint-disable-next-line
    }, [])

    return (
        <Modal show={show} onHide={closeModal} centered size="lg">
            <Modal.Header className={style.ModalBody}>
                <Modal.Title>
                    <p>Edit Literature</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.ModalBody}>
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <Alert variant="warning">
                            <i className="fas fa-exclamation me-2"></i>
                            Cancel message : {msg?.reason}
                        </Alert>
                        <FloatingLabel label="Title" className="mb-3">
                            <Form.Control className={style.Input} defaultValue={data.title} name="title" onChange={handleChange}/>
                        </FloatingLabel>
                        <FloatingLabel label="Publication Date" className="mb-3">
                            <Form.Control className={style.Input} type="date" name="pubDate" defaultValue={data.pubDate} onChange={handleChange}/>
                        </FloatingLabel>
                        <FloatingLabel label="ISBN" className="mb-3">
                            <Form.Control className={style.Input} name="isbn" defaultValue={data.isbn} onChange={handleChange}/>
                        </FloatingLabel>
                        <FloatingLabel label="pages" className="mb-3">
                            <Form.Control className={style.Input} type="number" name="pages" defaultValue={data.pages} onChange={handleChange}/>
                        </FloatingLabel>
                        <FloatingLabel label="Author" className="mb-3">
                            <Form.Control className={style.Input} name="author" defaultValue={data.author} onChange={handleChange}/>
                        </FloatingLabel>
                        <Form.Control type="file" className="d-none" accept="application/pdf" ref={inputPdf} name="pdf" onChange={handleChange}/>
                        <div>
                            <button className={`${style.ButtonFile} text-light m-0`} onClick={buttonPdf}>Attach Book File
                                <img src="/assets/icons/attach.png" alt="attach" className={style.ImageButton} />
                            </button>
                            <p className="text-light ms-3 d-inline-block m-0">{form?.pdf && form.pdf.name}</p>
                        </div>
                       <Button type="submit" variant="danger" className="mt-3">Send</Button>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    )
}
