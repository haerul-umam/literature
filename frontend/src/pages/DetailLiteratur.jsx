import {Container, Button} from "react-bootstrap"
import Header from "../components/Header"
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useEffect, useState, useContext } from "react";
import { API, download } from "../config/api";
import { AuthContext } from "../context/authContext";
import { useParams } from "react-router-dom";
import style from "./css/DetailLiteratur.module.css"
import { ToastContainer, toast } from 'react-toastify';

export default function DetailLiteratur() {
    const [stateUser,] = useContext(AuthContext)
    const {id} = useParams()
    const [literatur, setLiteratur] = useState({})
    const [show, setShow] = useState(true)

    const getLiteratur = async () => {
        try{
            const response = await API.get(`/literatur/${id}`)
            console.log(response.data.literatur.user.email , stateUser.user.email)
            if (response.data.literatur.user.email === stateUser.user.email) {
                setShow(false)
            }
            console.log(response.data.literatur)
            setLiteratur(response.data.literatur)
        }catch(e){
            console.log(e)
        }
    }

    const handleCollection = async (type) => {
        try{
            const config = {
                headers: {"Content-type": "application/json"}
            }
            const data = JSON.stringify({idLiteratur: id})
            let response
            if (type === "add"){
                response = await API.post("/collection", data, config)
            }else{
                response = await API.delete("/collection/" + id)
            }

            if (response.status === 200) {
                toast.success(`${response.data.message}`,{autoClose: 2000})
                getLiteratur()
            }
        }catch(e){
            console.log(e)
            toast.info(e.response.data.message)
        }
    }

    const renderButton = () => {
        if (literatur.collection === "N"){
            return (
                <Button variant="danger" style={{height:"fit-content"}} onClick={()=>{handleCollection("add")}}>
                    Add To Collection
                    <i className="far fa-bookmark ms-2"></i>
                </Button>
            )
        }else{
            return (
                <Button variant="danger" style={{height:"fit-content"}} onClick={()=>{handleCollection("remove")}}>
                    Remove From Collection
                    <i className="fas fa-bookmark ms-2"></i>
                </Button>
            )
        }
    }

    useEffect(()=> {
        getLiteratur()
        //eslint-disable-next-line
    },[])

    return (
        <>
            <Header show={true}/>
            <Container className="d-flex my-auto">
                <div className="px-3">
                    <a href={literatur.files}>
                        <Document file={literatur.files}>
                            <Page pageNumber={1} height={543} loading="Loading pdf.." />
                        </Document>
                    </a>
                </div>
                <div className="px-3 w-100">
                    <div className="d-flex justify-content-between">
                        <h1 className={style.Title}>{literatur.title}</h1>
                        {show && renderButton()}
                    </div>
                    <p className={style.Subtitle}>{literatur.author}</p>
                    <p className={`text-light m-0 ${style.Subtitle}`} style={{fontWeight:800, fontSize:"24px"}}>Publication Date</p>
                    <p className={style.Subtitle}>{literatur.pubDate}</p>
                    <p className={`text-light m-0 ${style.Subtitle}`} style={{fontWeight:800, fontSize:"24px"}}>Pages</p>
                    <p className={style.Subtitle}>{literatur.pages}</p>
                    <p className={`fw-bold m-0 text-danger ${style.Subtitle}`} style={{fontWeight:800, fontSize:"24px"}}>ISBN</p>
                    <p className={style.Subtitle}>{literatur.isbn}</p>
                    <Button variant="danger" onClick={() => { download(literatur.files,literatur.title)}}>
                        Download
                        <i className="fas fa-cloud-download-alt ms-2"></i>
                    </Button>
                </div>
            <ToastContainer/>
            </Container>
        </>
    )
}
