import { Container, Row, Col, Button } from "react-bootstrap";

function Home(){
    return(
        <>
            <Container className="py-5">
                <Row className="text-center">
                    <Col lg="8" className="mx-auto">
                        <h2 className="h5 mb-3">Bienvenido a nuestro sistema de busqueda de medicina prepaga</h2>
                        <p>En un mundo donde el cuidado de la salud es una prioridad, elegir un plan de medicina prepaga adecuada puede marcar la diferencia en su bienestar. Nuestro buscador le permite comparar planes de salud de distintas prestadoras, adaptados a sus necesidades.<br/>
                        Con solo unos clics, podrá acceder a información detallada sobre las opciones disponibles, incluyendo coberturas y beneficios.</p>
                        <p>Encuentre la mejor opción para usted y su familia de manera rápida y sencilla.</p>
                        <Button variant="primary" href="/cotizador">Cotizar</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Home