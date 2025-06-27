import Prepaga from "../models/prepagaModel.js";

const getPrepagas = async (request, response) => {
    try {

        const { nombre, rnemp } = request.query;

        const filtros = {};

        if (rnemp) { filtros.rnemp = parseInt(rnemp); }

        if (nombre) { filtros.nombre = { $regex: nombre, $options: 'i' }; }

        const prepagas = await Prepaga.find(filtros);

        response.status(200).json({ msg: 'ok', data: prepagas});
    } catch (error) {
        console.log(error)
        response.status(500).json({msg: 'Error del servidor', data: []});
    }
}

const getPrepagaById = async (request, response) => {
    try {
        const { id } = request.params;
        const prepaga = await Prepaga.findById(id);
        if (prepaga) {
            response.status(200).json({ msg: 'ok', data: prepaga});
        } else {
            response.status(404).json({msg: 'No se encontro la prepaga solicitada', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const addPrepaga = async (request, response) => {
    try {
        const {nombre, rnemp} = request.body;

        // Valida que no tenga el numero de registro vacio, no sea negativa y que sea un numero
        if (!rnemp || rnemp < 0 || isNaN(rnemp) ){
            return response.status(404).json({msg: 'Datos incompletos'})
        }

        // Valida que no exita el plan para una misma prepaga
        const data = await Prepaga.findOne({rnemp: rnemp});
        if (data){
            return response.status(404).json({msg: 'Ya se encuentra registrado ese RNEMP'})
        }

        const prepagaNew = new Prepaga({nombre, rnemp});
        await prepagaNew.save();

        const id = prepagaNew._id;

        response.status(202).json({msg: `Prepaga guardada id: ${id}`, data: prepagaNew })
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

const deletePrepagaById = async (request, response) => {
    try {
        const { id } = request.params;
        const status = await Prepaga.findByIdAndDelete(id);
        if (status) {
            response.status(200).json({ msg: 'Prepaga eliminada exitosamente', data:[]});
        } else {
            response.status(404).json({msg: 'No se encontro la prepaga solicitada', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const updatePrepagaById = async (request, response) => {
    try {
        const { id } = request.params;
        const {nombre, rnemp} = request.body;

        // Valida que no tenga el nombre vacio 
        if (!nombre ){
            return response.status(404).json({msg: 'Datos incompletos'})
        }

        const prepaga = {nombre, rnemp};
        const prepagaUpdate = await Prepaga.findByIdAndUpdate(id, prepaga);
        if (prepagaUpdate) {
            response.status(200).json({ msg: 'Datos de la prepaga actualizada', data: prepaga});
        } else {
            response.status(404).json({msg: 'No se encontro la prepaga solicitada', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

export { getPrepagas, getPrepagaById, addPrepaga, deletePrepagaById, updatePrepagaById};