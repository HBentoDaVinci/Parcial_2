import { useState } from "react";
import { Card, Col, Container, Row, Form, Button } from 'react-bootstrap';
import CardPlanes from "../components/CardPlanes";

function Cotizador(){
    const host = import.meta.env.VITE_API_URL;
    const [planes, setPlanes] = useState([]);
    const [usuario, setUsuario] = useState({ nombre: "", email: "" });
    const [filtros, setFiltros] = useState({edad: "", grupoFamiliar: "", prepaga:"",});
    const [errores, setErrores] = useState({});

    function handlerForm(e){
        e.preventDefault();

        const nuevosErrores = {};

        if (!usuario.nombre.trim()) {
            nuevosErrores.nombre = "Debe ingresar un nombre";
        }
        if (!usuario.email.trim()) {
            nuevosErrores.email = "Debe ingresar un email";
        } else if (!/\S+@\S+\.\S+/.test(usuario.email)) {
            nuevosErrores.email = "Debe ingresar un email válido";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores({});
        getPlanesConsulta();
    }

    async function getPlanesConsulta(){

        const queryParams = new URLSearchParams({
            edad: filtros.edad,
            grupoFamiliar: filtros.grupoFamiliar,
            //prepaga: filtros.prepaga
        });

        try {
            const response = await fetch(`${host}/planes?${queryParams.toString()}`);
            if (!response.ok) {
                alert("Error al solicitar los planes");
                return
            }
            const {data} = await response.json();
            setPlanes(data)
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    function resetoForm() {
        setUsuario({ nombre: "", email: "" });
        setFiltros({ edad: "", grupoFamiliar: "" });
        setPlanes([]);
        setErrores({})
    }

    return(
        <>
            <Container className='py-5'>
                <Row className="mb-5">
                    <Col lg="10" className='mx-auto'>
                        <div>
                            <h2>Cotizador</h2>
                            <p>Desde este formulario usted podrá realizar una busqueda optimizada de una prepaga acorde a sus preferencias.</p>
                        </div>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handlerForm}>
                                    <Row className="pb-3">
                                        <Form.Group as={Col} controlId="nombre" className='mb-3'>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Su nombre" 
                                                value={usuario.nombre} 
                                                onChange={(e)=>setUsuario({...usuario, nombre: e.target.value})} 
                                                isInvalid={!!errores.nombre}
                                            />
                                            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                placeholder="Email" 
                                                value={usuario.email} 
                                                onChange={(e)=>setUsuario({...usuario, email: e.target.value})} 
                                                isInvalid={!!errores.email}
                                            />
                                            <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="border-top pt-3">
                                        <Form.Group as={Col} sm={2} controlId="edadConsulta" className='mb-3'>
                                            <Form.Label>Edad</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="Edad" 
                                                value={filtros.edad} 
                                                onChange={(e)=>setFiltros({...filtros, edad: e.target.value})} 
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-3" controlId="grupoFamiliar">
                                            <Form.Label as="legend" column sm={12} className="pt-0">Grupo Familiar</Form.Label>
                                            <div className='d-flex py-2'>
                                                <Form.Check 
                                                    type="radio" 
                                                    label="Soltero" 
                                                    name="grupoFamiliar" 
                                                    id="gfIndividual" 
                                                    className='me-3'
                                                    value={"individual"}
                                                    onChange={(e) => setFiltros({ ...filtros, grupoFamiliar: e.target.value })}
                                                    checked={filtros.grupoFamiliar === "individual"}
                                                />
                                                <Form.Check 
                                                    type="radio" 
                                                    label="Casado sin hijos" 
                                                    name="grupoFamiliar" 
                                                    id="gfMatrimonio"
                                                    className='me-3'
                                                    value={"matrimonio"}
                                                    onChange={(e) => setFiltros({ ...filtros, grupoFamiliar: e.target.value })}
                                                    checked={filtros.grupoFamiliar === "matrimonio"}
                                                />
                                                <Form.Check 
                                                    type="radio" 
                                                    label="Casado con hijos" 
                                                    name="grupoFamiliar" 
                                                    id="gfFamiliar"
                                                    value={"familiar"}
                                                    onChange={(e) => setFiltros({ ...filtros, grupoFamiliar: e.target.value })}
                                                    checked={filtros.grupoFamiliar === "familiar"}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Row>
                                    <Form.Group className="d-flex">
                                        <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' onClick={resetoForm}>BORRAR</Button>
                                        <Button size="sm" type="submit" variant='primary'>CONSULTAR</Button>
                                    </Form.Group>
                                    {/* {planes.length === 0 && 
                                        <div className="text-center pt-3">
                                            <Alert variant="warning" className="p-3 d-inline-block mx-auto">
                                                <p className="text-center mb-0">No tenemos registrado ningun plan con para esas caracteristicas. Por favor realice otra consulta o bien revise el listado de <a href="/planes">planes</a> </p>
                                            </Alert>
                                        </div>
                                    } */}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {planes.length > 0 &&
                    <>
                        <hr/>
                        <Row>
                            <Col lg="12" className='mx-auto'>
                                <div className="mb-3">
                                    <h3 className="h4 mb-0">Planes</h3>
                                    <p className="mb-0 small">Estos son los planes que encontramos para usted</p>
                                </div>
                                <Row>
                                    {planes.map((plan, index)=>(
                                        <Col key={index} sm={4} className="d-flex align-items-stretch">
                                            <CardPlanes 
                                                nombre={plan.nombre} 
                                                rangoEtario={plan.rangoEtario} 
                                                cobertura={plan.cobertura} 
                                                grupoFamiliar={plan.grupoFamiliar} 
                                                prepaga={plan.prepaga} 
                                                tarifa={plan.tarifa}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
            </Container>
        </>
    )
}
export default Cotizador