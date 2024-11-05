import { Router } from "express";
import { getInformationFromSapiensForPicaPauControllerRefactor } from "../modules/GetInformationFromSapienForSamir/Refactor";
import { atualizacaoDossiePrevidenciarioController } from "../modules/AtualizacaoDossiePrevidenciario";
import { verificadorValidadeDossiePrevidenciarioController } from '../modules/VerificadorValidadeDossiePrevidenciario/index';
import { verificadorDeDupliciadeController } from "../modules/VerificadorDeDupliciade";
import { createInterestedController } from "../modules/CreateInterested";


export const routerGetInformationsForSamir = Router();

/**
 * @swagger
 * /samir/getInformationFromSapienForSamir:
 *   post:
 *     summary: get Information From Sapien For Samir
 *     tags: [GetInformationFromSapien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetInformationsFromSapiens'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InformationsForCalcule'
 *                 
 *       500:
 *         description: Some server error
 *       400:
 *         description: The request error
 */

// ALTERADA PARA O TESTE DE REFACTOR

// ORIGINAL
// routerGetInformationsForSamir.post("/getInformationFromSapienForSamir", async (req, res) => {
//     return getInformationFromSapienForSamirController.handle(req, res);
// })

// REFACTOR
routerGetInformationsForSamir.post("/getInformationFromSapienForSamir", async (req, res) => {
    return getInformationFromSapiensForPicaPauControllerRefactor.handle(req, res);
})

/**
 * @swagger
 * /samir/atualizaoDossiePrevidenciario:
 *   post:
 *     summary: get Information From Sapien For Samir
 *     tags: [GetInformationFromSapien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetInformationsFromSapiens'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InformationsForCalcule'
 *                 
 *       500:
 *         description: Some server error
 *       400:
 *         description: The request error
 */


routerGetInformationsForSamir.post("/atualizaoDossiePrevidenciario", async (req, res) => {
    return atualizacaoDossiePrevidenciarioController.handle(req, res);
})



/**
 * @swagger
 * /samir/verificadorValidadeDossiePrevidenciario:
 *   post:
 *     summary: get Information From Sapien For Samir
 *     tags: [GetInformationFromSapien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetInformationsFromSapiens'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InformationsForCalcule'
 *                 
 *       500:
 *         description: Some server error
 *       400:
 *         description: The request error
 */
routerGetInformationsForSamir.post("/verificadorValidadeDossiePrevidenciario", async (req, res) => {
    return verificadorValidadeDossiePrevidenciarioController.handle(req, res);
})

/**
 * @swagger
 * /samir/verificadorDeDupliciade:
 *   post:
 *     summary: get Information From Sapien For Samir
 *     tags: [GetInformationFromSapien]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetInformationsFromSapiens'
 *     responses:
 *       200:
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InformationsForCalcule'
 *                 
 *       500:
 *         description: Some server error
 *       400:
 *         description: The request error
 */
routerGetInformationsForSamir.post("/verificadorDeDupliciade", async (req, res) => {
    return verificadorDeDupliciadeController.handle(req, res);
})




routerGetInformationsForSamir.post("/createInteressados", async (req, res) => {
    return createInterestedController.handle(req, res);
})





