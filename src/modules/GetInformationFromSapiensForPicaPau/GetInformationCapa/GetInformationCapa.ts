import axios from "axios";
require('dotenv').config();
import { JSDOM } from 'jsdom';

type AdvogadoReturn = {
    encontrouAdvogado: boolean;
    nomeDoAdvogado?: string;
}

export class GetInformationCapa{
    async ImpedimentosCapa(capaHTML: any): Promise<AdvogadoReturn>{
        let nomeAdvogado: string;

        if (capaHTML instanceof JSDOM) {
            capaHTML = capaHTML.serialize();
        }

        const novoArray = await this.buscarAdvogados();

        for(let i=0; i<novoArray.length; i++){
            if((capaHTML.indexOf(novoArray[i])) !== -1){
                nomeAdvogado = novoArray[i];
                return {
                    encontrouAdvogado: false,
                    nomeDoAdvogado: nomeAdvogado
                }
            }
        }

        return {
            encontrouAdvogado: true
        }

    }

    async buscarAdvogados(): Promise<any[]> {
        let baseUrl = process.env.CONTROLER_IP;
        let port = process.env.CONTROLER_PORT;
        try {
            const response = await axios.get(`${baseUrl}:${port}/register/advogados`)
            const newArrayAdvogados = response.data.map((advogado) => (
                advogado.nome
            ))
            return newArrayAdvogados;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


}


