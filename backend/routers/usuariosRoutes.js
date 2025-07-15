import express from "express";
import multer from "multer";
import { getUsuarios, getUsuarioByEmail, getUsuarioById, addUsuario, deleteUsuarioById, updateUsuarioById, auth } from "../controllers/usuariosController.js";
import { validacionToken } from "../middlewares/autenticacion.js";
import { uploadController } from "../controllers/uploadController.js";

const router = express.Router();

// Configuramos multer
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (request, file, cb) => {
        const fileName = Date.now()+'_'+file.originalname 
        cb(null, fileName )
    }
});
const upload = multer({storage: storage});

// Definimos las rutas
router.get('/', validacionToken, getUsuarios);
router.get('/:id', validacionToken, getUsuarioById);
router.post('/', validacionToken, upload.single('avatar'), addUsuario);
router.post('/auth', auth);
router.put('/:id', validacionToken, upload.single('avatar'), updateUsuarioById);
router.delete('/:id', validacionToken, deleteUsuarioById);
//router.put('/:id', upload.single('file'), updateUserById);

// Ruta para subir archivos
router.post('/upload', upload.single('avatar'), uploadController);

export default router;