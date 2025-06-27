import planesRouter from "./planesRoutes.js";
import prepagasRouter from "./prepagasRoutes.js";
import usuariosRouter from "./usuariosRoutes.js";

function routerApi (app) {
    app.use('/api/planes', planesRouter);
    app.use('/api/prepagas', prepagasRouter);
    app.use('/api/usuarios', usuariosRouter);
}

export default routerApi;