import Plan from "../models/planModel.js";
import Prepaga from "../models/prepagaModel.js";

const getPlanes = async (request, response) => {
    try {

        const { prepaga, edad, nombre, grupoFamiliar } = request.query;

        const filtros = {};

        if (edad) {
            const edadNum = parseInt(edad, 10);
            // el valor de minimo deber ser menor o igual al de edad - less than or equal
            filtros['rangoEtario.min'] = { $lte: edadNum };
            // el valor de maximo debe ser mayor o igual al de edad - greater than or equal
            filtros['rangoEtario.max'] = { $gte: edadNum };
        }

        if (prepaga) { filtros.prepaga = {$regex: prepaga, $options: 'i'}; }

        if (nombre) { filtros.nombre = { $regex: nombre, $options: 'i' }; }

        if (grupoFamiliar) filtros.grupoFamiliar = grupoFamiliar;

        const planes = await Plan.find(filtros).populate('prepaga');

        response.status(200).json({ msg: 'ok', data: planes});
    } catch (error) {
        console.log(error)
        response.status(500).json({msg: 'Error del servidor', data: []});
    }
}

const getPlanById = async (request, response) => {
    try {
        const { id } = request.params;
        const plan = await Plan.findById(id).populate('prepaga');
        if (plan) {
            response.status(200).json({ msg: 'ok', data: plan});
        } else {
            response.status(404).json({msg: 'No se encontro el plan solicitado', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const addPlan = async (request, response) => {
    try {
        const {nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa} = request.body;

        // Valida que no tenga el nombre ni la prepaga vacia 
        if (!nombre || !prepaga ){
            return response.status(404).json({msg: 'Datos incompletos'})
        }

        // Verifica que el ID de prepaga sea válido y exista
        const prepagaExiste = await Prepaga.findById(prepaga);
        if (!prepagaExiste) {
            return response.status(404).json({ msg: 'La prepaga cargada no existe en nuestra base de datos' });
        }

        // Valida que no exita el plan para una misma prepaga
        const data = await Plan.findOne({nombre: nombre, prepaga: prepaga});
        if (data){
            return response.status(404).json({msg: 'Ya existe un plan con ese nombre para esa prepaga'})
        }

        // Valida que la edad mínima no sea mayor a la máxima
        if (rangoEtario.min > rangoEtario.max) {
            return response.status(400).json({ error: 'La edad mínima no puede ser mayor que la máxima' });
        }

        // Valida que la tarifa no sea negativa y que sea un numero
        if (tarifa < 0 || isNaN(tarifa)) {
            return response.status(400).json({ error: 'La tarifa no es correcta' });
        }

        const planNew = new Plan({nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa});
        await planNew.save();

        const id = planNew._id;

        response.status(202).json({msg: `Plan guardado id: ${id}`, data: planNew })
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

const deletePlanById = async (request, response) => {
    try {
        const { id } = request.params;
        const status = await Plan.findByIdAndDelete(id);
        if (status) {
            response.status(200).json({ msg: 'Plan eliminado exitosamente', data:[]});
        } else {
            response.status(404).json({msg: 'No se encontro el plan solicitado', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

const updatePlanById = async (request, response) => {
    try {
        const { id } = request.params;
        const {nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa} = request.body;

        // Valida que no tenga el nombre ni la prepaga vacia 
        if (!nombre || !prepaga ){
            return response.status(404).json({msg: 'Datos incompletos'})
        }

        // Valida que no exita el plan para una misma prepaga
        const planActual = await Plan.findById(id);
        if (!planActual) {
            return response.status(404).json({ msg: 'No se encontró el plan solicitado' });
        }
        const nombreCambio = planActual.nombre !== nombre;
        const prepagaCambio = planActual.prepaga !== prepaga;
        if (nombreCambio || prepagaCambio) {
            const data = await Plan.findOne({nombre: nombre, prepaga: prepaga, _id: { $ne: id } });
            if (data){
                return response.status(404).json({msg: 'Ya existe un plan con ese nombre para esa prepaga'})
            }
        }

        // Valida que la edad mínima no sea mayor a la máxima
        if (rangoEtario.min > rangoEtario.max) {
            return response.status(400).json({ error: 'La edad mínima no puede ser mayor que la máxima' });
        }

        // Valida que la tarifa no sea negativa y que sea un numero
        if (tarifa < 0 || isNaN(tarifa)) {
            return response.status(400).json({ error: 'La tarifa no es correcta' });
        }

        const plan = {nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa};
        const planUpdate = await Plan.findByIdAndUpdate(id, plan);
        if (planUpdate) {
            response.status(200).json({ msg: 'Datos del plan actualizado', data: plan});
        } else {
            response.status(404).json({msg: 'No se encontro el plan solicitado', data: []});
        }
    } catch (error) {
        console.log({error});
        response.status(500).json({error: 'Error del servidor', data: []});
    }
}

export { getPlanes,  getPlanById, addPlan, deletePlanById, updatePlanById};