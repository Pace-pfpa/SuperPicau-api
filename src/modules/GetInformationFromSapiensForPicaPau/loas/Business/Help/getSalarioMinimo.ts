import axios from "axios";
require('dotenv').config();

export async function getSalarioMinimo (ano: string) {
    try {
        let baseUrl = process.env.CONTROLER_IP;
        let port = process.env.CONTROLER_PORT;
        const response = await axios.get(`${baseUrl}:${port}/register/findSalarioMinimo/${ano}`);
        const data = response.data;
        if (data.length === 0) return [ { valor: '0' } ];
        return data;
    } catch (error) {
        console.error(`Erro ao buscar o salário mínimo para o ano ${ano}`);
        if (ano === '2024') {
            return [
                { id: 11, ano: '2024', valor: '1412' }
            ]    
        }
        return [ { valor: '0' } ];
    }
}