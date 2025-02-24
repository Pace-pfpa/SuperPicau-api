import express from 'express';
import path from "path";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Options } from '../config/swagger';
import { routerGetInformationsForSamir } from './GetInformationsForSamirroutes.routes';
import { routerInsertSapiens } from './InsertSapiensForSamir.routes';


export const routes = express();

routes.use("/samir", routerInsertSapiens);
routes.use("/samir", routerGetInformationsForSamir);



/**
 * Swagger Roter
 */
const swaggerSpec = swaggerJSDoc(Options);
routes.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

routes.use('/back-docs', express.static(path.join(__dirname, "../../docs")));

/**
 * Error tratament
 */
routes.use((req, res, next) => {
    const error = new Error("I`m Batman!!");
    next(error)
})
routes.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})
