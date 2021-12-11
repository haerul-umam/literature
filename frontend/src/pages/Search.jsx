import {Container, Button, Row, Col} from "react-bootstrap"
import Header from "../components/Header"
import CardLiteratur from "../components/CardLiteratur"
import DatePicker from "react-datepicker"
import style from "./css/Search.module.css"
import { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { API } from "../config/api";


function useQuery() {
    const {search} = useLocation()
    return useMemo(() => new URLSearchParams(search),[search])
}

export default function Search() {
    const [year, setYear] = useState(new Date())
    const [text, setText] = useState("")  // text search
    const [params, setParams] = useState("")
    const [result, setResult] = useState([])
    const [all, setAll] = useState([]) // all literature
    const [show, setShow] = useState(false)
    const query = useQuery()
    const navigate = useHistory()

    const searching = () => {
        if(text) {
            const link = `/search?q=${text}&year=${year.getFullYear()}` ///search?q=majalah&year=2020
            setParams(link)
            navigate.push(link)
        }
    }

    const getSearch = async () => {
        try{
            const q = query.get("q")
            const y = query.get("year")
            const response = await API.get(`/search?q=${q}&year=${y ? y : year.getFullYear()}`)
            if (response.data.literatur.length === 0 || response.data.literatur.length > 0) {
                setShow(true)
                setAll([])
            }
            if (!q) {
                setShow(false)
                getAll()
            }
            setResult(response.data.literatur)
        }catch(e){
            console.log(e)
        }
    }

    const getAll = async () => {
        try{
            const response = await API.get("/literaturs")
            if (response.data.literatur.length > 0) setShow(false) 
            setAll(response.data.literatur)
        }catch(e){
            console.log(e)
        }
    }

    const textNotFound = () => {
        if (show) {
            if (!result.length) {
                return (
                    <p className="text-light">Not found anything for 
                    <i className="text-danger"> {query.get("q")}.</i> Show all literature ? 
                    <button className={style.Button} onClick={getAll}>klik !</button>
                    </p> 
                )
            }
        }
    }

    useEffect(()=> {
        getSearch()
        //eslint-disable-next-line
    },[params])

    return (
        <>
            <Header show={true}/>
            <Container>
                <Row>
                    <Col md={6} className="mt-4">
                        <div className="w-75 d-flex">
                            <input type="text" className={`${style.Input} me-2 w-100`} placeholder="Search for literature" onChange={(e) => {setText(e.target.value)}}/>
                            <Button variant="danger" onClick={searching}><i className="fas fa-search"></i></Button>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col md={2}>
                        <p className="text-danger">Anytime</p>
                        <DatePicker
                        showYearPicker
                        dateFormat="yyyy"
                        onChange={(date) => setYear(date)}
                        className={style.Input}
                        placeholderText={`Since ${year.getFullYear()}`}
                        />
                    </Col>
                    <Col md={9} className="offset-md-1 d-flex flex-wrap">
                        {
                            result.map(item => {
                                return <CardLiteratur key={item.id} data={item}/>
                            })
                        }
                        {
                            all.map(item => {
                                return <CardLiteratur key={item.id} data={item}/>
                            })
                        }
                        {textNotFound()}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
