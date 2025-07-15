import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ModalEliminarPlan from "../../components/ModalEliminarPlan";
import CardPlan from "../../components/CardPlan";

function VerPlan(){
    const token = localStorage.getItem("token");
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
        tarifa: ""
    });
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
                    <Col lg="8" className='mx-auto'>
                        <div>
                            <h3 className="h4">Plan <small className="fw-normal">#{id}</small></h3>
                        </div>
                        <CardPlan 
                            id={plan._id}
                            nombre={plan.nombre} 
                            rangoEtario={plan.rangoEtario} 
                            cobertura={plan.cobertura} 
                            grupoFamiliar={plan.grupoFamiliar}
                            prepaga={plan.prepaga}
                            tarifa={plan.tarifa}
                            handleShowModal={handleShowModal}
                        />
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
export default VerPlan