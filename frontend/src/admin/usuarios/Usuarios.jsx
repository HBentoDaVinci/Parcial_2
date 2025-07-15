import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Modal, Alert, Card, Form, Collapse, FormGroup} from "react-bootstrap";
import ModalEliminarUsuario from "../../components/ModalEliminarUsuario";
import userDefault from "../../assets/img/default-avatar.png";

function Usuarios(){
    const token = localStorage.getItem("token");
    const host = import.meta.env.VITE_API_URL;
    const [open, setOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({nombre: "", email: "", password:"", avatar: ""});
    const [showAlertUsuario, setShowAlertUsuario] = useState(false);
    const [validated, setValidated] = useState(false);

    // Modal eliminar
    const [showEliminar, setShowEliminar] = useState(false);
    const [usuarioActivo, setUsuarioActivo] = useState({_id: "", nombre: "", email:"", avatar: ""});
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

    async function getUsuarios(){
        try {
            const response = await fetch(`${host}/usuarios`, {
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                alert("Error al solicitar los usuarios");
                return
            }
            const {data} = await response.json();
            setUsuarios(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getUsuarios()
    }, [])

    function handlerForm(e){
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        addUsuario();
    }

    async function addUsuario(){
        console.log('nuevo usuario', usuario)
        const formData = new FormData();
        formData.append("nombre", usuario.nombre);
        formData.append("email", usuario.email);
        formData.append("password", usuario.password);
        if (usuario.avatar) {
            formData.append("avatar", usuario.avatar);
        }
        const opciones = {
            method: "POST",
            headers: {
                //"Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            //body: JSON.stringify(usuario)
            body: formData
        };
        try {
            const response = await fetch(`${host}/usuarios`, opciones);
            if (!response.ok) {
                const errorApi = await response.json();
                alert(`Error al agregar un nuevo usuario - ${errorApi.msg}`);
                return
            }
            const {data} = await response.json();
            setShowAlertUsuario(true)
            setTimeout(() => {
                setShowAlertUsuario(false);
            }, 1000);
            setUsuarios([...usuarios, data]);
            setUsuario({nombre: "", email: "", password:"", avatar: ""})
            setValidated(false);
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
            await getUsuarios();
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                handleCloseModal();
            }, 3000);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    function resetoForm() {
        setUsuario({nombre: "", email: "", password:"", avatar: ""})
        setShowAlertUsuario(false);
        setValidated(false);
    }

    return(
        <>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col lg="8" className="mx-auto">
                        <h2 className="h5 mb-3">Administrador</h2>
                    </Col>
                </Row>

                <Row>
                    <Col lg="10" className="mx-auto">
                        <div className="d-flex justify-content-between mb-3">
                            <h3 className="h4">Listado de usuarios</h3>
                            <Button variant="success" size="sm" onClick={() => setOpen(!open)} aria-controls="example-fade-text" aria-expanded={open}>
                                {!open && <>Agregar nuevo usuario</>}
                                {open && <>Cerrar</>}
                            </Button>
                        </div>
                        <Collapse in={open}>
                            <div id="example-collapse-text" className="mb-5">
                                <Card>
                                    <Card.Header>
                                        <div>
                                            <h3 className="h4">Nuevo usuario</h3>
                                            <p className="small mb-0">Desde este formulario usted podrá agregar un nuevo usuario.</p>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handlerForm} noValidate validated={validated} encType="multipart/form-data">
                                            <Row>
                                                <Form.Group as={Col} controlId="nombre" className='mb-3'>
                                                    <Form.Label>Nombre</Form.Label>
                                                    <Form.Control 
                                                        required
                                                        type="text" 
                                                        placeholder="Nombre" 
                                                        name="nombre"
                                                        value={usuario?.nombre || ""} 
                                                        onChange={handlerChange} 
                                                    />
                                                    <Form.Control.Feedback type="invalid">Debe ingresar un nombre.</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="email" className='mb-3'>
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control 
                                                        required
                                                        type="email" 
                                                        placeholder="Email" 
                                                        name="email"
                                                        value={usuario.email} 
                                                        onChange={handlerChange} 
                                                    />
                                                    <Form.Control.Feedback type="invalid">Debe ingresar un email válido.</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="password" className='mb-3'>
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control 
                                                        required
                                                        type="password" 
                                                        placeholder="Password" 
                                                        name="password"
                                                        value={usuario.password} 
                                                        onChange={handlerChange} 
                                                    />
                                                    <Form.Control.Feedback type="invalid">Debe ingresar una password.</Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group controlId="avatar" className="mb-3">
                                                    <Form.Label>Avatar</Form.Label>
                                                    <Form.Control type="file" name="avatar" accept="image/*" onChange={handlerChange} />
                                                </Form.Group>
                                            </Row>
                                            {showAlertUsuario && 
                                                <Alert variant="success" className="p-2">Usuario agregado correctamente.</Alert>
                                            }
                                            <Form.Group className="d-flex">
                                                <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' onClick={resetoForm}>BORRAR</Button>
                                                <Button size="sm" type="submit" variant='primary'>AGREGAR</Button>
                                            </Form.Group>
                                        </Form>

                                    </Card.Body>
                                </Card>
                            </div>
                        </Collapse>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th colSpan={2} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((us, i)=>(
                                    <tr key={i}>
                                        <td>
                                            {us.avatar &&
                                                <img alt={us.name} src={`${host.replace('/api', '')}/${us.avatar}`} width="40" height="40" className="d-inline-block align-middle me-2 rounded-circle"/>
                                            }
                                            {!us.avatar &&
                                                <img alt={us.name} src={userDefault} width="40" height="40" className="d-inline-block align-middle me-2 rounded-circle"/>
                                            }
                                        </td>
                                        <td>{us._id}</td>
                                        <td>{us.nombre}</td>
                                        <td><a href={`mailto: ${us.email}`} target="_blank">{us.email}</a></td>
                                        <td className="text-center"><Button variant="outline-primary" size="sm" href={`/admin/editarUsuario/${us._id}`}>Editar</Button></td>
                                        <td className="text-center"><Button variant="danger" size="sm" onClick={()=>handleShowModal(us)}>Eliminar</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
export default Usuarios