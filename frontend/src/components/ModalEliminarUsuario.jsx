import { Button, Modal, Alert} from "react-bootstrap";

function ModalEliminarUsuario({showEliminar, handleCloseModal, usuarioActivo, showAlert, deleteUsuario}){

    return (
        <Modal show={showEliminar} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Usuario <small>#{usuarioActivo?._id}</small></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>¿Desea eliminar a <strong>{usuarioActivo?.nombre}</strong>?</p>
                {showAlert && 
                    <Alert variant="success">Usuario eliminado correctamente.</Alert>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={handleCloseModal}>CANCELAR</Button>
                {!showAlert &&
                    <Button variant="danger" size="sm" onClick={()=>{deleteUsuario(usuarioActivo?._id)}}>ELIMINAR</Button>
                }
                {showAlert &&
                    <Button variant="primary" size="sm" onClick={handleCloseModal}>CERRAR</Button>
                }
            </Modal.Footer>
        </Modal>
    )
}
export default ModalEliminarUsuario