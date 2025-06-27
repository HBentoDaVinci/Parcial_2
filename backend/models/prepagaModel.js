import mongoose from "mongoose";

const Schema = mongoose.Schema;

const prepagaSchema = new Schema({
    nombre: {type: String, required: [true, "El nombre es obligatorio"]},
    // rnemp - numero de registro nacional de entidades de medicina prepaga
    rnemp: {type: Number, required: [true, "El número de registro nacional es obligatorio y único"], unique: true}
});

const Prepaga = mongoose.model('prepaga', prepagaSchema);

export default Prepaga