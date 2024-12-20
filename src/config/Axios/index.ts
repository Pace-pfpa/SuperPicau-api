import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
const SAPIENS_URL: string = process.env.SAPIENS_URL;

export const Sapiens = axios.create({
    baseURL: SAPIENS_URL,
});

export { axios };