import { Router } from "express";
import { insertSapiensMinutasController } from "../modules/InsertSapiensMinutas";
import { loginController } from "../modules/LoginUsuario";
import { getUsuarioController } from "../modules/GetUsuario";
import { getTarefaController } from "../modules/GetTarefa";
import { getArvoreDocumentoController } from "../modules/GetArvoreDocumento";
import { updateEtiquetaController } from "../modules/UpdateEtiqueta";
import { getCapaDoPassivaController } from "../modules/GetCapaDoPassiva";

//const sessao = request.session();

export const routerInsertSapiens = Router();

/**
 * @swagger
 * /samir/insertMinutas:
 *   post:
 *     summary: Inser minutas in the sapiens
 *     tags: [InserMinuta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InserirMemoriaCalculo'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coockie'
 *                 
 *       500:
 *         description: Some server error
 *       400:
 *         description: The request error
 */


routerInsertSapiens.post("/insertMinutas", async (req, res) => {
    return insertSapiensMinutasController.handle(req, res);
})

 
/**
 * @swagger
 * /samir/login:
 *   post:
 *     summary: Inser minutas in the sapiens
 *     tags: [InserMinuta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coockie'
 *                 
 *       500:
 *         description: Some server error
 *       400:
 *         description: The request error
 */


routerInsertSapiens.post("/login", async (req, res) => {
    return loginController.handle(req, res);
})

routerInsertSapiens.post("/getUsuarioController", async (req, res) => {
    return getUsuarioController.handle(req, res);
})

routerInsertSapiens.post("/getTarefaController", async (req, res) => {
    return getTarefaController.handle(req, res);
})

routerInsertSapiens.post("/getArvoreDocumentoController", async (req, res) => {
    return getArvoreDocumentoController.handle(req, res);
})

routerInsertSapiens.post("/updateEtiqueta", async (req, res) => {
    return updateEtiquetaController.handle(req, res);
})

routerInsertSapiens.post("/getCapaDoPassivaController", async (req, res) => {
    return getCapaDoPassivaController.handle(req, res);
})














