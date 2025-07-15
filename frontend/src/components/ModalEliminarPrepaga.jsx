import { Button, Modal, Alert} from "react-bootstrap";

function ModalEliminarPrepaga({showEliminar, handleCloseModal, prepagaActiva, showAlert, deletePrepaga}){

    return (
        <Modal show={showEliminar} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Prepaga <small>#{prepagaActiva?._id}</small></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {!showAlert &&
                    <p>¿Desea eliminar a <strong>{prepagaActiva?.nombre}</strong>?</p>
                }
                {showAlert && 
                    <Alert variant="success">La prepaga fue eliminada correctamente.</Alert>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={handleCloseModal}>CANCELAR</Button>
                {!showAlert &&
                    <Button variant="danger" size="sm" onClick={()=>{deletePrepaga(prepagaActiva?._id)}}>ELIMINAR</Button>
                }
                {showAlert &&
                    <Button variant="primary" size="sm" onClick={handleCloseModal}>CERRAR</Button>
                }
            </Modal.Footer>
        </Modal>
    )
}
export default ModalEliminarPrepaga