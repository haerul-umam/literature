import {Container, Button, Form} from "react-bootstrap"
import Header from "../components/Header"
import style from "./css/AddLiteratur.module.css"
import { ToastContainer, toast } from 'react-toastify';
import { useState,useRef } from "react"
import { API } from "../config/api"

export default function AddLiteratur() {
    const [form, setForm] = useState({})
    const inputPdf = useRef(null)
    const handleChange = (e) => {
        try{
            setForm(prev => ({
                ...prev, [e.target.name] : e.target.type === "file" ? e.target.files : e.target.value
            }))
        }catch(e){
            console.log(e)
        }
    }

    const buttonPdf = (e) => {
        e.preventDefault()
        inputPdf.current.click()
    }

    const handleSubmit = async (e) => {
        try{
            e.preventDefault()
            if (!form.pdf) return toast.error("please select book file")

            const config = {
                headers : {"Content-type": "multipart/form-data"}
            }

            const formData = new FormData()
            formData.set("title", form.title)
            formData.set("pages", form.pages)
            formData.set("pubDate", form.pubDate)
            formData.set("isbn", form.isbn)
            formData.set("author", form.author)
            formData.append("pdf", form.pdf[0])
           
            const response = await API.post("/literatur", formData, config)
            if (response.status === 200) toast.success(`${response.data.message}`)
        }catch(e){
            toast.error(`${e.response.data.message}`)
            console.log(e)
        }
    }
    return (
        <>
            <Header show={true}/>
            <Container>
                <h2 className={style.Title}>Add Literature</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Control type="text" name="title" placeholder="Title" className={style.Input} onChange={handleChange} required/>
                    <Form.Control type="text" name="pubDate" placeholder="Publication Date" className={style.Input} onChange={handleChange} required onMouseEnter={(e) => {e.target.type='date'}} onMouseLeave={(e) => {e.target.type='text'}}/>
                    <Form.Control type="text" name="isbn" placeholder="ISBN" className={style.Input} onChange={handleChange} required/>
                    <Form.Control type="number" name="pages" placeholder="Pages" className={style.Input} onChange={handleChange} required/>
                    <Form.Control type="text" name="author" placeholder="Author" className={style.Input} onChange={handleChange} required/>
                    <Form.Control type="file" className="d-none" accept="application/pdf" ref={inputPdf} name="pdf" onChange={handleChange} />
                    <div>
                        <button className={`${style.ButtonFile} text-light m-0`} onClick={buttonPdf}>Attach Book File
                            <img src="/assets/icons/attach.png" alt="attach" className={style.ImageButton} />
                        </button>
                        <p className="text-light ms-3 d-inline-block m-0">{form?.pdf && form.pdf[0].name}</p>
                    </div>
                    <div className="text-end">
                        <Button type="submit" variant="danger">Submit</Button>
                    </div>
                </Form>
                <ToastContainer />
            </Container>
        </>
    )
}
