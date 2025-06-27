import express from "express";
import { getPrepagas, getPrepagaById, addPrepaga, deletePrepagaById, updatePrepagaById} from '../controllers/prepagasController.js';
import { validacionToken } from "../middlewares/autenticacion.js";

const router = express.Router();

// Definimos las rutas
router.get('/', getPrepagas);
router.get('/:id', getPrepagaById);
router.post('/', addPrepaga);
router.put('/:id', updatePrepagaById);
router.delete('/:id', deletePrepagaById);

export default router;