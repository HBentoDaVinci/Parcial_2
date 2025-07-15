import express from "express";
import { getPrepagas, getPrepagaById, addPrepaga, deletePrepagaById, updatePrepagaById} from '../controllers/prepagasController.js';
import { validacionToken } from "../middlewares/autenticacion.js";

const router = express.Router();

// Definimos las rutas
router.get('/', getPrepagas);
router.get('/:id', validacionToken, getPrepagaById);
router.post('/', validacionToken, addPrepaga);
router.put('/:id', validacionToken, updatePrepagaById);
router.delete('/:id', validacionToken, deletePrepagaById);

export default router;