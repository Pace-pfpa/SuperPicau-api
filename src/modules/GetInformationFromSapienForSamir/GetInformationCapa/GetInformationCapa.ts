
export class GetInformationCapa{
    constructor(){};
    async ImpedimentosCapa(capaHTML: any): Promise<boolean>{

        //Estrutura para identificar nome dos Advogados
        const arrayAdvogadosPilantra: Array<string> = ["SABRINA DE PONTES ARAUJO",
        "ADRIANO GOMES DE DEUS",
        "ANDERSON JOSÉ LOPES FRANCO",
        "ARIANNE RIBEIRO CESAR",
        "EDER NILSON VIANA DA SILVA",
        "EUCLIDES RABELO ALENCAR",
        "EVANDRO SOUZA MUNIZ",
        "EDUARDO VIEIRA MARTINS",
        "FRANKLIN DAYWISON JAQUES",
        "ESCRITÓRIO ADVOCACIA CAVALCANTE & MONT SERRAT",
        "GUILHERME HENRIQUE BRANCO DE OLIVEIRA",
        "ITALO BENEDITO DA CRUZ MAGALHÃES",
        "KELLY JAMILLY DE OLIVEIRA FERREIRA",
        "RAYMUNDO MAURÍCIO PINTO JÚNIOR",
        "RONALDO DIAS CAVALCANTE",
        "SABRINA PONTES DE ARAÚJO",
        "SILANY SOARES ASSIS",
        "TARCÍSIO SAMPAIO DA SILVA",
        "WENNYSON DA SILVA CARDOSO",
        "WILLIAM VIANA DA SILVA",
        "ABEL BRITO DE QUEIROZ",
        "ALDEANE COSTA VASCONCELOS",
        "JOSÉ LENILTON MORAIS LINHARES",
        "GUTENBERG BARROS DE ANDRADE",
        "GLEIDIVÂNIA SANTOS DA SILVA",
        "JOÃO PAULO DE LIMA SILVA",
        "RÔMULO ALVES COSTA",
        "GEORGE STHEFANE PIMENTA DA SILVA",
        "GUSTAVO MICHELOTTI FLECK",
        "CARLOS ALEXANDRE BATISTA DA SILVA",
        "DANILLO SOUSA GAMA",
        "RONICLEITON PINHEIRO MARTINS DE JESUS",
        "NAYRA DANIELLE ALMEIDA RIEDEL",
        "THEODORA SAMPAIO REIS DE OLIVEIRA",
        "VERIDIANE GOMES PEREIRA",
        "MARIA LUIZA MELO"];
        for(let i=0; i<arrayAdvogadosPilantra.length; i++){
            //console.log(arrayAdvogadosPilantra[i])
            if((capaHTML.indexOf(arrayAdvogadosPilantra[i])) !== -1){
                return false;
            }
        }
        return true;
    




    }


}


