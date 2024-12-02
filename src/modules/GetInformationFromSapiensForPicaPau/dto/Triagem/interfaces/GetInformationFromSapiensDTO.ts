
import { ITarefaResponse } from "../../../../GetTarefa/dtos/ITarefaResponse";
import { LoginDTO } from "../../../../LoginUsuario";

export interface GetInformationsFromSapiensDTO {
    login: LoginDTO;
    etiqueta: string;
    tarefa: ITarefaResponse;
    readDosprevAge: number;
    loas: boolean;
    admin: boolean;
}


/**
 * @swagger
 * components:
 *   schemas:
 *     GetInformationsFromSapiens:
 *       type: object
 *       required:
 *         - login
 *         - etiqueta
 *       properties:
 *         login:
 *           type: '#/components/schemas/Login'
 *           description: login sapiens
 *         etiqueta:
 *           type: string
 *           description: etiqueta do processo
 *       example:
 *         login: {cpf: "021273374328244", senha: maionesse122}
 *         etiqueta: LIDO BOOT
 *         
 * */

