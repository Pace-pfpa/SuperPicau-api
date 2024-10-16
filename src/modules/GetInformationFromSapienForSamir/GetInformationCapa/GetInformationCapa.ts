import axios from "axios";
require('dotenv').config();
import { JSDOM } from 'jsdom';

export class GetInformationCapa{
    constructor(){};
    async ImpedimentosCapa(capaHTML: any): Promise<boolean>{

        if (capaHTML instanceof JSDOM) {
            capaHTML = capaHTML.serialize();
        }

        const novoArray = await this.buscarAdvogados();

        // const arrayAdvogados: Array<string> = ["SABRINA DE PONTES ARAUJO",
        // "ADRIANO GOMES DE DEUS",
        // "ANDERSON JOSÉ LOPES FRANCO",
        // "ARIANNE RIBEIRO CESAR",
        // "EDER NILSON VIANA DA SILVA",
        // "EUCLIDES RABELO ALENCAR",
        // "EVANDRO SOUZA MUNIZ",
        // "EDUARDO VIEIRA MARTINS",
        // "FRANKLIN DAYWISON JAQUES",
        // "ESCRITÓRIO ADVOCACIA CAVALCANTE & MONT SERRAT",
        // "GUILHERME HENRIQUE BRANCO DE OLIVEIRA",
        // "ITALO BENEDITO DA CRUZ MAGALHÃES",
        // "KELLY JAMILLY DE OLIVEIRA FERREIRA",
        // "RAYMUNDO MAURÍCIO PINTO JÚNIOR",
        // "RONALDO DIAS CAVALCANTE",
        // "SABRINA PONTES DE ARAÚJO",
        // "SILANY SOARES ASSIS",
        // "TARCÍSIO SAMPAIO DA SILVA",
        // "WENNYSON DA SILVA CARDOSO",
        // "WILLIAM VIANA DA SILVA",
        // "ABEL BRITO DE QUEIROZ",
        // "ALDEANE COSTA VASCONCELOS",
        // "JOSÉ LENILTON MORAIS LINHARES",
        // "GUTENBERG BARROS DE ANDRADE",
        // "GLEIDIVÂNIA SANTOS DA SILVA",
        // "JOÃO PAULO DE LIMA SILVA",
        // "RÔMULO ALVES COSTA",
        // "GEORGE STHEFANE PIMENTA DA SILVA",
        // "GUSTAVO MICHELOTTI FLECK",
        // "CARLOS ALEXANDRE BATISTA DA SILVA",
        // "DANILLO SOUSA GAMA",
        // "RONICLEITON PINHEIRO MARTINS DE JESUS",
        // "NAYRA DANIELLE ALMEIDA RIEDEL",
        // "THEODORA SAMPAIO REIS DE OLIVEIRA",
        // "VERIDIANE GOMES PEREIRA",
        // "MARIA LUIZA MELO"];

        for(let i=0; i<novoArray.length; i++){
            if((capaHTML.indexOf(novoArray[i])) !== -1){
                return false;
            }
        }

        return true;

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


