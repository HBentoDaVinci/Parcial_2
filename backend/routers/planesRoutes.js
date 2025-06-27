import express from "express";
import { getPlanes, getPlanById, addPlan, deletePlanById, updatePlanById} from '../controllers/planesController.js';
import { validacionToken } from "../middlewares/autenticacion.js";

const router = express.Router();

// Definimos las rutas
router.get('/', getPlanes);
router.get('/:id', getPlanById);
router.post('/', addPlan);
router.put('/:id', updatePlanById);
router.delete('/:id', deletePlanById);

export default router;