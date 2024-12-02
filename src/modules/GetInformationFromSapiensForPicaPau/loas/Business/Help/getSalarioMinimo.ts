import axios from "axios";
require('dotenv').config();

export async function getSalarioMinimo (ano: string) {
    try {
        let baseUrl = process.env.CONTROLER_IP;
        let port = process.env.CONTROLER_PORT;
        const response = await axios.get(`${baseUrl}:${port}/register/findSalarioMinimo/${ano}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error(`Erro ao buscar o salário mínimo para o ano ${ano}:`, error);
        return [];
    }
}