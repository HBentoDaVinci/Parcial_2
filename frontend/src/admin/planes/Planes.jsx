import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Table, Alert, Collapse} from "react-bootstrap";
import ModalEliminarPlan from "../../components/ModalEliminarPlan";

function PlanesAdmin(){
    const token = localStorage.getItem("token");
    const host = import.meta.env.VITE_API_URL;
    const [open, setOpen] = useState(false);
    const [planes, setPlanes] = useState([]);
    const [prepagas, setPrepagas] = useState([]);
    const [plan, setPlan] = useState({
        nombre: "", 
        rangoEtario: {
            min: "",
            max: ""
        },
        cobertura: "",
        grupoFamiliar: [],
        prepaga:"",
        tarifa: ""
    });
     const [showAlertPlan, setShowAlertPlan] = useState(false);
     const [errores, setErrores] = useState({});

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
        const valor = e.target.value;
        const key = e.target.name;
        setPlan({...plan, [key]: valor})
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

    async function getPlanes(){
        try {
            const response = await fetch(`${host}/planes`);
            if (!response.ok) {
                alert("Error al solicitar los planes");
                return
            }
            const {data} = await response.json();
            setPlanes(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    async function getPrepagas(){
        try {
            const response = await fetch(`${host}/prepagas`);
            if (!response.ok) {
                alert("Error al solicitar las prepagas");
                return
            }
            const {data} = await response.json();
            setPrepagas(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getPlanes();
        getPrepagas();
    }, [])

    function handlerForm(e){
        e.preventDefault();

        const nuevosErrores = {};

        if (!plan.nombre.trim()) {
            nuevosErrores.nombre = "Debe ingresar un nombre";
        }

        if (!plan.rangoEtario.min || isNaN(plan.rangoEtario.min)) {
            nuevosErrores.rangoEtarioMin = "Debe asignar una edad mínima";
        }

        if (!plan.rangoEtario.max || isNaN(plan.rangoEtario.max)) {
            nuevosErrores.rangoEtarioMax = "Debe asignar una edad máxima";
        }

        if (!plan.cobertura.trim()) {
            nuevosErrores.cobertura = "Debe ingresar los detalles de la cobertura";
        }

        if (!Array.isArray(plan.grupoFamiliar) || plan.grupoFamiliar.length === 0) {
            nuevosErrores.grupoFamiliar = "Debe seleccionar al menos un item para el grupo familiar";
        }

        if (!plan.prepaga.trim()) {
            nuevosErrores.prepaga = "Debe ingresar el id de la prepaga";
        }

        if (!plan.tarifa || isNaN(plan.tarifa)) {
            nuevosErrores.tarifa = "Debe ingresar una tarifa válida";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores({});
        addPlan();
    }

    async function addPlan(){
        const opciones = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(plan)
        }
        try {
            const response = await fetch(`${host}/planes`, opciones);
            if (!response.ok) {
                alert("Error al guardar el plan");
                return
            }
            await getPlanes();
            setShowAlertPlan(true);

            setTimeout(() => {
                setShowAlertPlan(false);
            }, 1000);
            setPlan({
                nombre: "", 
                rangoEtario: {
                    min: 0,
                    max: 0
                },
                cobertura: "",
                grupoFamiliar: [],
                prepaga:"",
                tarifa: 0
            })
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    async function deletePlan(id){
        const opciones = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
        try {
            const response = await fetch(`${host}/planes/${id}`, opciones);
            if (!response.ok) {
                alert("Error al eliminar el plan");
                return
            }
            await getPlanes();
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
        setPlan({
            nombre: "", 
            rangoEtario: {
                min: "",
                max: ""
            },
            cobertura: "",
            grupoFamiliar: [],
            prepaga:"",
            tarifa: ""
        })
        setErrores({})
        setShowAlertPlan(false);
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
                    <Col lg="12" className="mx-auto">
                        <div className="d-flex justify-content-between mb-3">
                            <h3 className="h4">Listado de planes</h3>
                            <Button variant="success" size="sm" onClick={() => setOpen(!open)} aria-controls="example-fade-text" aria-expanded={open}>
                                {!open && <>Agregar nuevo plan</>}
                                {open && <>Cerrar</>}
                            </Button>
                        </div>
                        <Collapse in={open}>
                            <div id="example-collapse-text" className="mb-5">
                                <Card>
                                    <Card.Header>
                                        <div>
                                            <h3 className="h4">Nuevo plan</h3>
                                            <p className="small mb-0">Desde este formulario usted podrá agregar un nuevo plan.</p>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handlerForm}>
                                            <Row>
                                                <Form.Group as={Col} controlId="nombre" className='mb-4'>
                                                    <Form.Label>Denominación del plan</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Nombre"
                                                        name="nombre" 
                                                        value={plan.nombre} 
                                                        onChange={handlerChange} 
                                                        isInvalid={!!errores.nombre}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} lg={2} controlId="edadMin" className='mb-4'>
                                                    <Form.Label>Edad mínima</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        placeholder="Desde" 
                                                        name="rangoEtario"
                                                        value={plan.rangoEtario.min} 
                                                        onChange={(e)=>setPlan({...plan, rangoEtario:{...plan.rangoEtario, min: Number(e.target.value)}})} 
                                                        isInvalid={!!errores.rangoEtarioMin}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errores.rangoEtarioMin}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} lg={2} controlId="edadMax" className='mb-4'>
                                                    <Form.Label>Edad máxima</Form.Label>
                                                    <Form.Control 
                                                        type="number" 
                                                        placeholder="Hasta" 
                                                        name="rangoEtario"
                                                        value={plan.rangoEtario.max} 
                                                        onChange={(e)=>setPlan({...plan, rangoEtario:{...plan.rangoEtario, max: Number(e.target.value)}})} 
                                                        isInvalid={!!errores.rangoEtarioMax}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errores.rangoEtarioMax}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="prepaga" className='mb-4'>
                                                    <Form.Label>Prepaga</Form.Label>
                                                    <Form.Select name="prepaga" value={plan.prepaga} onChange={handlerChange} isInvalid={!!errores.prepaga}>
                                                        <option value="">Seleccionar prepaga</option>
                                                        {prepagas.map((prepaga) => (
                                                            <option key={prepaga._id} value={prepaga._id}>
                                                                {prepaga.nombre}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">{errores.prepaga}</Form.Control.Feedback>
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
                                                {errores.grupoFamiliar && (
                                                    <div className="text-danger small mt-1">{errores.grupoFamiliar}</div>
                                                )}
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="tarifa" className='mb-4'>
                                                <Form.Label>Tarifa</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="$" 
                                                    name="tarifa"
                                                    value={plan.tarifa} 
                                                    onChange={handlerChange} 
                                                    isInvalid={!!errores.tarifa}
                                                />
                                                <Form.Control.Feedback type="invalid">{errores.tarifa}</Form.Control.Feedback>
                                            </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group className="mb-4" controlId="cobertura">
                                                    <Form.Label>Cobertura</Form.Label>
                                                    <Form.Control as="textarea" rows={3}
                                                    value={plan.cobertura}
                                                    name="cobertura"
                                                    onChange={handlerChange}
                                                    isInvalid={!!errores.cobertura}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errores.cobertura}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            {showAlertPlan && 
                                                <Alert variant="success" className="p-2">Plan agregado correctamente.</Alert>
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
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Prepaga</th>
                                    <th style={{width: '20px'}} className="text-center">Edad Min</th>
                                    <th style={{width: '20px'}} className="text-center">Edad Max</th>
                                    <th>Tarifa</th>
                                    <th colSpan={3} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planes.map((plan, i)=>(
                                    <tr key={i}>
                                        <td><span className="small">{plan._id}</span></td>
                                        <td>{plan.nombre}</td>
                                        <td>{plan.prepaga?.nombre}</td>
                                        <td className="text-center">{plan.rangoEtario.min}</td>
                                        <td className="text-center">{plan.rangoEtario.max}</td>
                                        <td>$ {plan.tarifa}</td>
                                        <td className="text-center"><Button variant="danger" size="sm" onClick={()=>handleShowModal(plan)}>Eliminar</Button></td>
                                        <td className="text-center"><Button variant="outline-primary" size="sm" href={`/admin/editarPlan/${plan._id}`}>Editar</Button></td>
                                        <td className="text-center"><Button variant="primary" size="sm" href={`/admin/verPlan/${plan._id}`}>Ver</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
export default PlanesAdmin