import { useState, useContext } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login(){
    const host = import.meta.env.VITE_API_URL;
    const [usuario, setUsuario] = useState({email: "", password:""});
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const [validated, setValidated] = useState(false);

    function handlerForm(e){
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        loginUsuario();
    }

    function handlerChange(e){
        setUsuario({...usuario, [e.target.name]: e.target.value})
    }

    async function loginUsuario(){
        const opciones = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(usuario)
        }
        try {
            const response = await fetch(`${host}/usuarios/auth`, opciones);
            if (!response.ok) {
                const errorApi = await response.json();
                console.log(`Error al loguear - ${errorApi.msg}`);
                return
            }
            const data = await response.json();
            if (data.token){
                login('user', data.token);
                navigate('/admin/planes')
            }

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
                    <Col lg="6" className='mx-auto'>
                        <div>
                            <h3 className="h4">Login</h3>
                            <p className="small">Ingrese su usuario y constraseña</p>
                        </div>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={handlerForm}>
                                    <Row>
                                        <Form.Group controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control 
                                                required
                                                type="email" 
                                                placeholder="email" 
                                                name="email"
                                                value={usuario.email} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Por favor ingrese un email válido.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="password" className='mb-3'>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control 
                                                required
                                                type="text" 
                                                placeholder="Password" 
                                                name="password"
                                                value={usuario.password} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Por favor ingrese una password válida.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Form.Group className="mb-3 d-flex justify-content-center">
                                        <Button type="submit" variant='primary'>INGRESAR</Button>
                                    </Form.Group>
                                </Form>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Login