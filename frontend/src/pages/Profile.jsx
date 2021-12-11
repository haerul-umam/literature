import { useEffect, useState } from "react"
import {API} from "../config/api"
import {Container, Button, Image, Modal, Form, Row, Col, FloatingLabel} from "react-bootstrap"
import Header from "../components/Header"
import ProfileInfo from "../components/ProfileInfo"
import ModalEdit from "../components/Modal/ModalEdit"
import style from "./css/Profile.module.css"
import { ToastContainer, toast } from 'react-toastify';
import CardLiteratur from "../components/CardLiteratur"

export default function Profile() {
    const [profile, setProfile] = useState({})
    const [literatur, setLiteratur] = useState([])
    const [show, setShow] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [preview, setPreview] = useState(null)
    const [form, setForm] = useState({})

    const closeModal = () => {
        setShowEdit(false)
        setShow(false)
        setPreview(null)
        setForm({})
    }

    const getProfile = async () => {
        try {
            const response = await API.get("/profile")
            const literatur = await API.get("user/literatur")
            setProfile(prev => response.data.profile)
            setLiteratur(prev => literatur.data.literatur)
           
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        try {
            if (e.target.type === "file" && e.target.files.length > 0) {
              let url = URL.createObjectURL(e.target.files[0]);
              setPreview(url);
            }
            if (e.target.type === "file" && e.target.files.length === 0) setPreview(null)

            setForm((prev) => ({
              ...prev,
              [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
            }));
        
        } catch (e) {
            console.log(e);
        }
    };
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
    
            const config = {
              headers: {
                "Content-type": "multipart/form-data",
              }
            };
          
            const formData = new FormData()
            for (let prop in form){
                formData.set(prop, form[prop])
            }
            if(form.image && form.image.length > 0) formData.set("image", form.image[0])
            if(form.image && form.image.length === 0) formData.delete("image")

            const response = await API.put("/profile", formData, config);
            if (response.status === 200){
              getProfile()
              toast.success(`${response.data.message}`)
            }

        }catch (e) {
            console.log(e)
            toast.error(`${e.response.data.message}`)
        }
    };

    const deleteLiteratur = async (id) => {
        try{
            const response = await API.delete("/user/literatur/" + id)
            if (response.status === 200){
                toast.success(response.data.message)
                getProfile()
            } 
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        getProfile()
    },[])

    return (
        <>
            <Header show={true}/>
            <Container>
            <h2 className={style.Title}>Profile</h2>
                <div className="p-4 d-flex justify-content-between flex-wrap" style={{backgroundColor: "#252525"}}>
                    <div className={style.ProfileLayout}>
                        <ProfileInfo data={{img: "mail.png", name: profile.email, info: "Email"}} />
                        <ProfileInfo data={{img: "gender.png", name: profile.gender, info: "Gender"}} />
                        <ProfileInfo data={{img: "telp.png", name: profile.phone, info: "Mobile phone"}} />
                        <ProfileInfo data={{img: "location.png", name: profile.address, info: "Address"}} />
                    </div>
                    <div>
                        <Image className={style.ImageProfile} 
                        src={profile.image ? profile.image : 'assets/images/noavatar.png'}/>
                        <Button className="d-block mt-2 w-100" variant="danger" onClick={()=>{ setShow(true) }}>Change Profile</Button>
                    </div>
                </div>
            <h2 className={style.Title} style={{margin: "2rem 0"}}>My Literature</h2>
            <div className="d-flex flex-wrap justify-content-start mb-3">
                {
                    literatur.map(item => {
                        return (
                        <div key={item.id} className={style.WrapperCard}>
                            <CardLiteratur data={item}/>
                            <p className={style.Status}>{item.status}</p>
                            {item.status === "Cancel" &&
                                <>
                                <div className={`${style.Button} d-flex justify-content-evenly`}>
                                <Button size="sm" variant="danger" onClick={()=> {deleteLiteratur(item.id)}}>Delete</Button>
                                <Button size="sm" variant="info" 
                                onClick={()=> {setShowEdit(true)}}>Edit and reapply</Button>
                                </div>
                                <ModalEdit show={showEdit} close={setShowEdit} profile={getProfile} data={item}
                                />
                                </>
                            }
                        </div>
                        )
                    })
                }
            </div>

            <Modal show={show} onHide={closeModal} centered size="lg">
                <Modal.Header  className={style.ModalBody}>
                    <Modal.Title >
                        <p>Edit Profile</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body  className={style.ModalBody}>
                    <Container>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md>
                                    <Row className="g-2 mb-2">
                                        <Col md>
                                            <FloatingLabel label="Email">
                                                <Form.Control type="text" name="email" defaultValue={profile.email} className={style.Input} onChange={handleChange}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md>
                                            <FloatingLabel label="Phone">
                                                <Form.Control type="text" name="phone" defaultValue={profile.phone} className={style.Input} onChange={handleChange}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <Row className="g-2 mb-2">
                                        <Col md={3}>
                                            <FloatingLabel label="Gender">
                                                <Form.Select className={style.Input} name="gender" defaultValue={profile.gender} onChange={handleChange}>
                                                    <option value="DEFAULT" disabled>Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                 </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md>
                                            <FloatingLabel label="Address">
                                                <Form.Control type="text" name="address" defaultValue={profile.address} className={style.Input} onChange={handleChange}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <div className="d-flex align-items-center justify-content-center flex-column">
                                        <Button variant="link" size="sm" className="text-light fw-bold" onClick={() => {
                                            document.getElementById("image").click();
                                        }}>
                                            select image
                                        </Button>
                                        {preview && <Image src={preview} style={{ maxHeight: "5.4rem", maxWidth: "100%" }} />}
                                    </div>
                                    <input type="file" id="image" name="image" accept="image/*" className="d-none" onChange={handleChange}/>
                                </Col>
                            </Row>
                            <Button type="submit" variant="danger">Update</Button>
                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>
            <ToastContainer />
            </Container>
        </>
    )
}
