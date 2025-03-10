import { IMinutasDTO } from "../../GetInformationFromSapiensForPicaPau/dto";

export interface IInserirMemoriaCalculoDTO {
    cookie: string;
    nup: string;
    etiqueta: string;
    minutas: Array<IMinutasDTO>;
}





/**
 * @swagger
 * components:
 *   schemas:
 *     InserirMemoriaCalculo:
 *       type: object
 *       required:
 *         - login
 *         - minutas
 *         - etiqueta
 *       properties:
 *         login:
 *           type: '#/components/schemas/Login'
 *           description: login sapiens
 *         etiqueta:
 *           type: string
 *           description: etiqueta do processo
 *         minutas:
 *           type: array
 *           description: conteudo da minuta (memoria do Calculo)
 *           example: [{numeroprocesso: "1000101", conteudo: "bhhmcasDD"}]
 *           items: 
 *             type: '#/components/schemas/Minutas'
 *       example:
 *         login: {cpf: "021273384528", senha: maionesse21}
 *         etiqueta: LIDO BOOT
 *         minutas: [{numeroprocesso: "1000101", conteudo: "bhhmcasDD"}]
 *         
 * */

