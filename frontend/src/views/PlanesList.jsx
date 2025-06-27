import { useState, useEffect } from "react"
import CardPlanes from "../components/CardPlanes"
import { Container, Row, Col } from "react-bootstrap"

function Planes(){
    const host = import.meta.env.VITE_API_URL;
    const [planes, setPlanes] = useState([]);

    useEffect(() => {
        async function getPlanes(){
            try {
                const response = await fetch(`${host}/planes`);
                if (!response.ok) {
                    alert("Error al solicitar los planes");
                    return
                }
                const {data} = await response.json();
                console.log('planes listado', data)
                setPlanes(data);
            } catch(error){
                console.error(error);
                alert("Ocurrio un problema en el servidor")
            }
        }
        getPlanes()
    }, [])

    return(
        <>
            <Container className='py-5'>
                <Row>
                    <Col lg="12" className='mx-auto'>
                        <h2>Planes</h2>
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
            </Container>
        </>
    )
}
export default Planes