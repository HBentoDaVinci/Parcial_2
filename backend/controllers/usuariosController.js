import { request, response } from "express";
import User from "../models/usuarioModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

const saltRounds = 10;

const getUsuarios = async (request, response) => {
    try {

        const { nombre, email } = request.query;

        const filtros = {};

        if (nombre) { filtros.nombre = { $regex: nombre, $options: 'i' }; }

        if (email) { filtros.email = { $regex: email }; }

        const usuarios = await User.find(filtros);

        response.status(200).json({ msg: 'ok', data: usuarios});
    } catch (error) {
        console.log(error)
        response.status(500).json({msg: 'Error del servidor', data: []});
    }
}

const getUsuarioById = async (request, response) => {
    try {
        const { id } = request.params;
        const usuario = await User.findById(id);
        if (usuario) {
            const data = {};
            data._id = usuario._id;
            data.nombre = usuario.nombre;
            data.email = usuario.email;
            data.avatar = usuario.avatar;
            
            response.status(200).json({ msg: 'ok', data});
        } else {
            response.status(404).json({msg: 'No se encontro el usuario solicitado', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const getUsuarioByEmail = async (request, response) => {
    try {
        const { email } = request.params;
        const usuarioByEmail = await User.findOne({email: email});
        const usuario = await User.findById(usuarioByEmail.id);
        if (usuario) {
            response.status(200).json({ msg: 'ok', data: usuario});
        } else {
            response.status(404).json({msg: 'No se encontro el usuario solicitado', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const addUsuario = async (request, response) => {
    try {
        const {nombre, email, password} = request.body;
        const avatarUrl = request.file.path;

        // Valida que no tenga el nombre ni el email vacio 
        if (!nombre || !email || !password ){
            return response.status(404).json({msg: 'Datos incompletos'})
        }

        // Valida que no exita el email
        const data = await User.findOne({email: email});
        if (data){
            return response.status(404).json({msg: 'Ya existe un usuario con ese email'})
        }

        if (password.length < 4) {
            return response.status(404).json({msg: 'El password debe tener al menos 4 caracteres'})
        }
        // Hasheo la pass
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const usuarioNew = new User({nombre, email, password: passwordHash, avatar: avatarUrl});
        await usuarioNew.save();

        const id = usuarioNew._id;

        response.status(202).json({msg: `Usuario creado con id: ${id}`, data:usuarioNew })
    } catch (error) {
        if (error.name === "ValidationError") {
            const listaErrores = Object.values(error.errors)[0].message;
            response.status(500).json({error: listaErrores})
        } else {
            console.log({error});
            response.status(500).json({error: 'Error del servidor'});
        }
    }
}

const deleteUsuarioById = async (request, response) => {
    try {
        const { id } = request.params;
        const status = await User.findByIdAndDelete(id);
        if (status) {
            response.status(200).json({ msg: 'Usuario eliminado exitosamente', data:[]});
        } else {
            response.status(404).json({msg: 'No se encontro el usuario solicitado', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const updateUsuarioById = async (request, response) => {
    try {
        const { id } = request.params;
        const {nombre, email, password} = request.body;
        const avatarUrl = request.file.path;

        // Valida que no tenga el nombre ni el email ni la password vacia 
        if (!nombre || !email || !password ){
            return response.status(404).json({msg: 'Datos incompletos'})
        }

        // Hasheo la pass
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const usuario = {nombre, email, password: passwordHash, avatar: avatarUrl};
        const usuarioUpdate = await User.findByIdAndUpdate(id, usuario);
        if (usuarioUpdate) {
            response.status(200).json({ msg: 'Datos del usuario actualizado', data: usuario});
        } else {
            response.status(404).json({msg: 'No se encontro el usuario solicitado', data: []});
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            const listaErrores = Object.values(error.errors)[0].message;
            response.status(500).json({error: listaErrores})
        }
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

// Autenticación (login)
const auth = async (request, response) => {
    try {
        const { email, password} = request.body;

        // Verifo que el email exista
        const usuario = await User.findOne({email});
        if (!usuario) {
            return response.status(404).json({msg: "El mail es inválido"});
        };

        // Comparo la password
        const psw = await bcrypt.compare(password, usuario.password);

        if (!psw) {
            return response.status(404).json({msg: "Contraseña inválida"});
        };

        const data = {
            id: usuario._id,
            email: usuario.email
        }
        // Genero el token, la firma digital
        const token = jsonwebtoken.sign(data, secret_key, {expiresIn: '120h'});

        response.json({msg: 'Autenticación exitosa', token: token});
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor'});
    }
}

export { getUsuarios,  getUsuarioById, getUsuarioByEmail, addUsuario, deleteUsuarioById, updateUsuarioById, auth};