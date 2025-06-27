import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const planSchema = new Schema({
    nombre: {type: String, required: [true, "El nombre es obligatorio"]},
    rangoEtario: {
        min: {type: Number, min: 0 },
        max: {type: Number, min: 0 }
    },
    cobertura: String,
    grupoFamiliar: [String],
    prepaga: {
        // dato relacionado a otra collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'prepaga',
        required: [true, "El dato de la prepaga es obligatorio"]
    },
    //prepaga: {type: String, required: [true, "El nombre de la prepaga es obligatorio"]},
    tarifa: Number
});

const Plan = mongoose.model('plan', planSchema);

export default Plan