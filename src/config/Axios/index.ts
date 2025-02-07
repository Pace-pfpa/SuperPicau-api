import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

/** 
 * A URL base do serviço SAPIENS, carregada a partir das variáveis de ambiente. 
 * 
 * @constant
 */
const SAPIENS_URL: string = process.env.SAPIENS_URL;

/**
 * Cliente HTTP consigurado para interagir com o sistema SAPIENS.
 * 
 * Este cliente é uma instância do Axios com a URL base definida a partir da variável de ambiente `SAPIENS_URL`.
 * 
 * @example
 * ```ts
 * import { Sapiens } from './sapiens';
 * Sapiens.get("/endpoint")
 *   .then(response => console.log(response.data))
 *   .catch(error => console.error(error));
 * ```
 */
export const Sapiens = axios.create({
    baseURL: SAPIENS_URL,
});

export { axios };