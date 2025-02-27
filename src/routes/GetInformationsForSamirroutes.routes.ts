import { Router } from "express";
import { getInformationFromSapiensForPicaPauControllerRefactor } from "../modules/GetInformationFromSapiensForPicaPau";
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


routerGetInformationsForSamir.post("/getInformationFromSapienForSamir", async (req, res) => {
    return getInformationFromSapiensForPicaPauControllerRefactor.handle(req, res);
})

routerGetInformationsForSamir.post("/createInteressados", async (req, res) => {
    return createInterestedController.handle(req, res);
})

routerGetInformationsForSamir.post("/cobranca", async (req, res) => {

})
