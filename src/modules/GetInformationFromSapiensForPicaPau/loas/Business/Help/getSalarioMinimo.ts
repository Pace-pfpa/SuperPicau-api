import axios from "axios";
import fs from "fs";
import path from "path";
require('dotenv').config();

function loadSalariosMinimos() {
    const filePath = path.join(__dirname, 'salariosMinimos.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}

export function getSalarioMinimo2023(isInicioAno: boolean) {
    if (isInicioAno) {
        return { id: 10, ano: '2023', valor: '1302' };
    } else {
        return { id: 10, ano: '2023', valor: '1320' };
    }
}

export async function getSalarioMinimo(ano: string) {
    try {
        let baseUrl = process.env.CONTROLER_IP;
        let port = process.env.CONTROLER_PORT;
        const response = await axios.get(`${baseUrl}:${port}/register/findSalarioMinimo/${ano}`);
        const data = response.data;
        if (data.length === 0) return [ { valor: '0' } ];
        return data;
    } catch (error) {
        console.error(`Erro ao buscar o salário mínimo para o ano ${ano}`);

        const salariosMinimos = loadSalariosMinimos();

        if (salariosMinimos[ano]) {
            return [salariosMinimos[ano]];
        }

        return [ { valor: '0' } ];
    }
}