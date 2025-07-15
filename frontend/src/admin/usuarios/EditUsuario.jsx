import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ModalEliminarUsuario from "../../components/ModalEliminarUsuario";
import userDefault from "../../assets/img/default-avatar.png";

function EditUsuario(){
    const token = localStorage.getItem("token");
    const host = import.meta.env.VITE_API_URL;
    const [usuario, setUsuario] = useState({ _id: "", nombre: "", email: "", password:"", avatar:""});
    const {id} = useParams();
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    // Modal eliminar
    const [showEliminar, setShowEliminar] = useState(false);
    const [usuarioActivo, setUsuarioActivo] = useState({_id: "", nombre: "", email:""});
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseModal = () => {
        setShowEliminar(false);
        setUsuarioActivo(null);
    }
    const handleShowModal = (usuarioEliminar) => {
        setUsuarioActivo({_id: usuarioEliminar._id, nombre: usuarioEliminar.nombre, email:usuarioEliminar.email});
        setShowEliminar(true);
    }

    function handlerChange(e){
        const { name, value, files } = e.target;
        if (name === "avatar") {
            setUsuario({ ...usuario, avatar: files[0] });
        } else {
            setUsuario({ ...usuario, [name]: value });
        }
    }

    async function getUsuario(){
        try {
            const response = await fetch(`${host}/usuarios/${id}`,{
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                alert("Error al solicitar el usuario solicitado");
                return
            }
            const {data} = await response.json();
            setUsuario(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getUsuario()
    }, [])

    // Previsualización del avatar (desde File o desde URL)
    const baseURL = host.replace('/api', '');
    const avatarPreview = usuario.avatar instanceof File
        ? URL.createObjectURL(usuario.avatar)
        : usuario.avatar
            ? `${baseURL}/${usuario.avatar}`
            : userDefault;

    useEffect(() => {
        return () => {
            if (usuario.avatar instanceof File) {
                URL.revokeObjectURL(usuario.avatar);
            }
        };
    }, [usuario.avatar]);

    async function editUsuario(event){
        event.preventDefault();
        const formData = new FormData();
        formData.append("nombre", usuario.nombre);
        formData.append("email", usuario.email);
        formData.append("password", usuario.password);

        if (usuario.avatar instanceof File) {
            formData.append("avatar", usuario.avatar); // solo si cambió el archivo
        }
        const opciones = {
            method: "PUT",
            headers: {
                //"Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            //body: JSON.stringify(usuario)
            body: formData
        }
        try {
            const response = await fetch(`${host}/usuarios/${id}`, opciones);
            if (!response.ok) {
                const errorApi = await response.json();
                alert(`Error al modificar el usuario - ${errorApi.msg}`);
                return
            }
            const {data} = await response.json();
            setUsuario({...usuario, data})
            setShowConfirm(true)
            setTimeout(() => {
                setShowConfirm(false);
                navigate("/admin/usuarios")
            }, 1000);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }
    
    async function deleteUsuario(id){
        const opciones = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const response = await fetch(`${host}/usuarios/${id}`, opciones);
            if (!response.ok) {
                alert("Error al eliminar el usuario");
                return
            }
            const data = await response.json();
            console.log(data.msg)
            navigate("/admin/usuarios")
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    return(
        <>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col lg="8" className="mx-auto">
                        <h2 className="h5 mb-3">Administrador</h2>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col lg="10" className='mx-auto'>
                        <div>
                            <h3 className="h4">Modificar usuario <span className="small fw-normal text-secondary">#{usuario._id}</span></h3>
                            <p className="small">Desde este formulario usted podrá modificar un usuario.</p>
                        </div>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={editUsuario} encType="multipart/form-data" >
                                    <Row>
                                        <Form.Group as={Col} controlId="nombre" className='mb-3'>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Nombre" 
                                                name="nombre"
                                                value={usuario?.nombre || ""} 
                                                onChange={handlerChange} 
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                placeholder="Email" 
                                                name="email"
                                                value={usuario.email} 
                                                onChange={handlerChange} 
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="password" className='mb-3'>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                placeholder="Password" 
                                                name="password"
                                                value={usuario.password} 
                                                onChange={handlerChange} 
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group controlId="avatar" className="mb-3">
                                            <Form.Label>Avatar</Form.Label>
                                            <div className="mb-2">
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar"
                                                    width="60"
                                                    height="60"
                                                    className="rounded-circle"
                                                    onError={(e) => { e.target.src = userDefault }}
                                                />
                                            </div>
                                            <Form.Control type="file" name="avatar" accept="image/*" onChange={handlerChange} />
                                        </Form.Group>
                                    </Row>
                                    {showConfirm &&
                                        <Alert variant="success">
                                            <p className="mb-0">Usuario actualizado correctamente!</p>
                                        </Alert>
                                    }
                                    <Form.Group className="d-flex">
                                        <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' href="/admin/usuarios">VOLVER</Button>
                                        <Button variant="danger" className="me-2" size="sm" onClick={()=>handleShowModal(usuario)}>ELIMINAR</Button>
                                        <Button size="sm" type="submit" variant='primary'>ACTUALIZAR</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <ModalEliminarUsuario 
                showEliminar={showEliminar} 
                handleCloseModal={handleCloseModal} 
                usuarioActivo={usuarioActivo} 
                showAlert={showAlert}
                deleteUsuario={deleteUsuario}
            />
        </>
    )
}
export default EditUsuario