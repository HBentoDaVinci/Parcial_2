import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre: {type: String, required: [true, "El nombre es obligatorio"]},
    email: {type: String, required: [true, "El email debe ser único y obligatorio"], unique: true },
    password: {type: String, required: [true, "El password es obligatorio"], minlength: [4, "El password debe tener al menos 4 caracteres"]},
    avatar: {type: String}
});

const User = mongoose.model('user', userSchema);

export default User