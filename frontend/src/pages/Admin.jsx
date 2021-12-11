import {Container, Button, Table, Modal, Form} from "react-bootstrap"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import { API } from "../config/api"
import style from "./css/Admin.module.css"

export default function Admin() {
    const [book, setBook] = useState([])  // store master data book
    const [show, setShow] = useState(false)
    const [idCancel,setIdCancel] = useState(null)
    const [msg, setMsg] = useState(null)

    const getData = async () => {
        try {
            const response = await API.get("/master-literatur")
            setBook(prev => response.data.literatur)
        } catch (error) {
            console.log(error)
        }
    }

    const badgeColor = (status) =>{
        switch(status){
            case "Waiting to be verified":
                return "text-warning"
            case "Approve":
                return "text-success"
            default:
                return "text-danger"
        }
    }

    const updateStatus = async (id,payload) => {
        try{
            const config = {
                headers : {"Content-type": "application/json"}
            }
            const data = JSON.stringify(payload)
            const response = await API.put(`/literatur/${id}`,data , config)
            if (response.status === 200) getData()

        }catch(e){
            console.log(e)
        }
    }

    const renderAction = (item) => {
        if (item.status === "Approve") return <i className="fa-lg fas fa-check-circle text-success"></i>
        if (item.status === "Cancel") return <i className="fa-lg fas fa-times-circle text-danger"></i>
        return (
            <>
            <Button size="sm" variant="danger" style={{width:"5rem"}}
            onClick={() => {setShow(true); setIdCancel(item.id)}}
            >Cancel</Button>
            <Button size="sm" variant="success" style={{width:"5rem"}}
            onClick={() => {updateStatus(item.id, {status:"Approve"})}}
            >Approve</Button>
            </>
        )
    }

    useEffect(() => {
        getData()
    },[])
    return (
        <>
            <Header show={false} admin={true}/>
            <Container className="bg-light flex-grow-1" fluid>
                <Container>
                    <h2 className="my-4">Book verification</h2>
                    <Table striped hover responsive className="align-middle">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Users</th>
                                <th scope="col">ISBN</th>
                                <th scope="col">Literatur</th>
                                <th scope="col">Status</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                book.map((item, i) => {
                                    return <tr key={item.id}>
                                        <td>{i + 1}</td>
                                        <td>{item.user.fullName}</td>
                                        <td>{item.isbn}</td>
                                        <td><a href={item.files} target="_blank" rel="noopener noreferrer">{item.title}</a></td>
                                        <td className={badgeColor(item.status)}>{item.status}</td>
                                        <td className="col-md-2">
                                            <div className="d-flex justify-content-evenly">

                                                {
                                                    renderAction(item)
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </Container>

                <Modal show={show} onHide={()=> {setShow(false)}} centered >
                    <Modal.Header className={style.ModalBody}>
                        <Modal.Title>Cancel Message</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => {
                        e.preventDefault()
                        updateStatus(idCancel, {status:"Cancel", message:msg})
                    }}>
                        <Modal.Body className={style.ModalBody}>
                                <Form.Control className={style.Input} onChange={(e)=>{(setMsg(e.target.value))}} required/>
                        </Modal.Body>
                        <Modal.Footer className={style.ModalBody}>
                            <Button variant="secondary" onClick={()=> {setShow(false)}}>
                                Close
                            </Button>
                            <Button type="submit" variant="danger">
                            Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

            </Container>
        </>
    )
}
