import express from "express";
import { getPlanes, getPlanById, addPlan, deletePlanById, updatePlanById} from '../controllers/planesController.js';
import { validacionToken } from "../middlewares/autenticacion.js";

const router = express.Router();

// Definimos las rutas
router.get('/', getPlanes);
router.get('/:id', getPlanById);
router.post('/', validacionToken, addPlan);
router.put('/:id', validacionToken, updatePlanById);
router.delete('/:id', validacionToken, deletePlanById);

export default router;