import jsonwebtoken, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const validacionToken = ((request, response, next) => {

    const jwt = request.headers.authorization;

    if (!jwt) {
        return response.status(401).json({msg: "Falta el token"});
    }

    const token = jwt.split(' ')[1];

    //console.log({token})

    // verificar
    jsonwebtoken.verify(token, secretKey, (error, decoded) => {
        if(error) {
            response.status(403).json({msg: 'Token inválido'})
        }

        request.userId = decoded.id;

        next()
    })

    
})
export { validacionToken }
