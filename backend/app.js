import express, { request, response } from "express";
import routerApi from "./routers/index.js";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cambiar variable URI_DB_CLOUD o URI_DB_LOCAL
const uri_db = process.env.URI_DB_CLOUD;

// creo la aplicacion de express
const app = express();

// conexion db
mongoose.connect(uri_db);
const db = mongoose.connection;
db.on('error', (error)=>{
    console.log('tenemos un error con la conexion a la base de datos')
    console.log(error)
});
db.once('open', ()=>{
    console.info('Conexion exitosa')
})

// Middleware
// Cors
app.use(cors());
// Soporte para json, para que pueda trabajar y traer json
app.use(express.json());

// Directorio estatico
app.use(express.static('public'));

// Directorio imagenes
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Pagina principal
// app.get('/', (request, response)=>{
//     response.send('<h1>Home</h1>')
// })

// llamamos a el routerApi
routerApi(app);

// escucha en el servidor
app.listen(port, ()=>{
    console.log(`Servidor en el puerto ${port}`)
})