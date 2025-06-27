import React, {Fragment} from "react";
import { Card, Button } from "react-bootstrap"

function CardPlan({id, nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa, handleShowModal}){

    return (
        <>
            <Card className="mb-4">
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                    <Card.Title>{nombre}</Card.Title>
                    <ul className="list-unstyled">
                        <li><small className="text-secondary">Prepaga: </small><span className="h6">{prepaga?.nombre}</span></li>
                        <li><small className="text-secondary">Edad:</small> {rangoEtario.min} a {rangoEtario.max} años.</li>
                        <li><small className="text-secondary">Grupo Familiar:</small> {grupoFamiliar.join(', ')}</li>
                    </ul>
                    {cobertura &&
                        <p><strong>Cobertura: </strong><br/>{cobertura}</p>
                    }
                    <p className="h6 fw-normal"><strong>Tarifa:</strong> $ {tarifa}</p>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex">
                        <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' href="/admin/planes">VOLVER</Button>
                        <Button variant="danger" className="me-2" size="sm" onClick={()=>handleShowModal({nombre: nombre, _id: id})}>ELIMINAR</Button>
                        <Button size="sm" type="submit" variant='primary' href={`/admin/editarPlan/${id}`}>EDITAR</Button>
                    </div>
                </Card.Footer>
            </Card>
        </>
    )

}
export default CardPlan