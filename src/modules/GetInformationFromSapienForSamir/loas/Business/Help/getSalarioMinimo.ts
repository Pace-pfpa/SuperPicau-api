import axios from "axios";
require('dotenv').config();

export async function getSalarioMinimo (ano: string) {
    try {
        let baseUrl = process.env.IP_MAQUINA;
        let port = process.env.SM_PORT;
        const response = await axios.get(`${baseUrl}:${port}/register/findSalarioMinimo/${ano}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error(`Erro ao buscar o salário mínimo para o ano ${ano}:`, error);
        return [];
    }
}