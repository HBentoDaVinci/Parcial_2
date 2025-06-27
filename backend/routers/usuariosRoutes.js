import express from "express";
import { getUsuarios, getUsuarioByEmail, getUsuarioById, addUsuario, deleteUsuarioById, updateUsuarioById, auth } from "../controllers/usuariosController.js";
import { validacionToken } from "../middlewares/autenticacion.js";

const router = express.Router();

// Definimos las rutas
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', addUsuario);
router.post('/auth', auth);
router.put('/:id', updateUsuarioById);
router.delete('/:id', deleteUsuarioById);

export default router;