import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ModalEliminarPlan from "../../components/ModalEliminarPlan";

function EditarPlan(){
    const host = import.meta.env.VITE_API_URL;
    const {id} = useParams();
    const [plan, setPlan] = useState({
        nombre: "", 
        rangoEtario: {
            min: 0,
            max: 0
        },
        cobertura: "",
        grupoFamiliar: [],
        prepaga:"",
        tarifa: 0
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    // Modal eliminar
    const [showEliminar, setShowEliminar] = useState(false);
    const [planActivo, setPlanActivo] = useState({_id: "", nombre: ""});
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseModal = () => {
        setShowEliminar(false);
        setPlanActivo(null);
    }
    const handleShowModal = (planEliminar) => {
        setPlanActivo({_id: planEliminar._id, nombre: planEliminar.nombre});
        setShowEliminar(true);
    }

    function handlerChange(e){
        setPlan({...plan, [e.target.name]: e.target.value})
    }

    function handleCheckboxChange(e) {
        const { value, checked } = e.target;
        setPlan(plan => {
            const itemsChecked = checked
                ? [...plan.grupoFamiliar, value]
                : plan.grupoFamiliar.filter(item => item !== value);
            return { ...plan, grupoFamiliar: itemsChecked};
        });
    }

    async function getPlanById(){
        try {
            const response = await fetch(`${host}/planes/${id}`);
            if (!response.ok) {
                alert("Error al solicitar los planes");
                return
            }
            const {data} = await response.json();
            setPlan(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getPlanById()
    }, [])


    async function editPlan(event){
        event.preventDefault();
        console.log('plan nuevo', plan)
        const opciones = {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(plan)
        }
        try {
            const response = await fetch(`${host}/planes/${id}`, opciones);
            if (!response.ok) {
                const errorApi = await response.json();
                alert(`Error al modificar el plan - ${errorApi.msg}`);
                return
            }
            const {data} = await response.json();
            setPlan({...plan, data})
            setShowConfirm(true)
            setTimeout(() => {
                setShowConfirm(false);
                navigate("/admin/planes")
            }, 1000);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    async function deletePlan(id){
        const opciones = {
            method: "DELETE"
        }
        try {
            const response = await fetch(`${host}/planes/${id}`, opciones);
            if (!response.ok) {
                alert("Error al eliminar el plan");
                return
            }
            const data = await response.json();
            console.log(data.msg)
            navigate("/admin/planes")
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
                    <Col lg="12" className='mx-auto'>
                        <div>
                            <h3 className="h4">Editar plan <small className="fw-normal">#{plan._id}</small></h3>
                            <p className="small">Desde este formulario usted podrá agregar un nuevo plan.</p>
                        </div>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={editPlan}>
                                    <Row>
                                        <Form.Group as={Col} controlId="nombre" className='mb-4'>
                                            <Form.Label>Denominación del plan</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Nombre"
                                                name="nombre" 
                                                value={plan.nombre} 
                                                onChange={handlerChange} 
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={2} controlId="edadMin" className='mb-4'>
                                            <Form.Label>Edad mínima</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="Edad" 
                                                name="rangoEtario"
                                                value={plan.rangoEtario.min} 
                                                onChange={(e)=>setPlan({...plan, rangoEtario:{...plan.rangoEtario, min: Number(e.target.value)}})} 
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} lg={2} controlId="edadMax" className='mb-4'>
                                            <Form.Label>Edad máxima</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="Edad" 
                                                name="rangoEtario"
                                                value={plan.rangoEtario.max} 
                                                onChange={(e)=>setPlan({...plan, rangoEtario:{...plan.rangoEtario, max: Number(e.target.value)}})} 
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="prepaga" className='mb-4'>
                                            <Form.Label>Prepaga</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Prepaga"
                                                name="prepaga" 
                                                value={plan.prepaga?._id} 
                                                onChange={handlerChange} 
                                                maxLength={100}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                     <Form.Group as={Col} className="mb-4" id="eCivil">
                                        <Form.Label as="legend" column sm={12}>Grupo Familiar</Form.Label>
                                        <div className='d-flex'>
                                            <Form.Check 
                                                type="checkbox" 
                                                label="Soltero" 
                                                name="eCivil" 
                                                id="eCivilSoltero" 
                                                className='me-3'
                                                value={"individual"}
                                                checked={plan.grupoFamiliar.includes("individual")}
                                                onChange={handleCheckboxChange}
                                            />
                                            <Form.Check 
                                                type="checkbox" 
                                                label="Casado" 
                                                name="eCivil" 
                                                id="eCivilCasado" 
                                                className='me-3'
                                                value={"matrimonio"}
                                                checked={plan.grupoFamiliar.includes("matrimonio")}
                                                onChange={handleCheckboxChange}
                                            />
                                            <Form.Check 
                                                type="checkbox" 
                                                label="Grupo Familiar x4" 
                                                name="eCivil" 
                                                id="eCivilFamiliar" 
                                                className='me-3'
                                                value={"familiar"}
                                                checked={plan.grupoFamiliar.includes("familiar")}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="tarifa" className='mb-4'>
                                        <Form.Label>Tarifa</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="$" 
                                            name="tarifa"
                                            value={plan.tarifa} 
                                            onChange={handlerChange} 
                                        />
                                    </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-4" controlId="cobertura">
                                            <Form.Label>Cobertura</Form.Label>
                                            <Form.Control as="textarea" rows={3}
                                            value={plan.cobertura}
                                            name="cobertura"
                                            onChange={handlerChange}
                                            />
                                        </Form.Group>
                                    </Row>
                                    {showConfirm && 
                                        <Alert variant="success" className="p-2">Plan actualizado correctamente.</Alert>
                                    }
                                    <Form.Group className="d-flex">
                                        <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' href="/admin/planes">VOLVER</Button>
                                        <Button variant="danger" className="me-2" size="sm" onClick={()=>handleShowModal(plan)}>ELIMINAR</Button>
                                        <Button size="sm" type="submit" variant='primary'>ACTUALIZAR</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ModalEliminarPlan 
                showEliminar={showEliminar} 
                handleCloseModal={handleCloseModal} 
                planActivo={planActivo} 
                showAlert={showAlert}
                deletePlan={deletePlan}
            />
        </>
    )
}
export default EditarPlan