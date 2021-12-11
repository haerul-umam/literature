import { useEffect, useState } from "react"
import {API} from "../config/api"
import {Container} from "react-bootstrap"
import Header from "../components/Header"
import style from "./css/Profile.module.css"
import CardLiteratur from "../components/CardLiteratur"

export default function MyCollection() {
    const [collection, setCollection] = useState([])

    const getMyCollections = async () => {
        try {
            const response = await API.get("/collection")
            setCollection(prev => response.data.collection)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getMyCollections()
    },[])

    return (
        <>
            <Header show={true}/>
            <Container>
            <h2 className={style.Title} style={{margin: "2rem 0"}}>My Collections</h2>
            <div className="d-flex flex-wrap justify-content-start">
                {
                    collection.map(item => {
                        return <CardLiteratur key={item.id} data={item.literature}/>
                    })
                }
            </div>
            </Container>
        </>
    )
}
