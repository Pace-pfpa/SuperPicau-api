import { calcularMediaAjuizamento } from "../../helps/calcularMediaAjuizamento";
import { calcularMediaRequerimento } from "../../helps/calcularMediaRequerimento";
import { removeDayMonthFromDate } from "../../helps/removeDayMonthFromDate";
import { removeDayYearFromDate } from "../../helps/removeDayYearFromDate";
import { compararPrioridade } from "../../loas/Business/Help/compareRenda";
import { getSalarioMinimo } from "../../loas/Business/Help/getSalarioMinimo";

export async function calcularRendaFamiliar(arrayObjetosEnvolvidos: any[], numMembrosFamilia: number, infoRequerente: any) {
    let salarioMinimoAjz: number = 0;
    let salarioMinimoReq: number = 0;

    const mediaAjuizamento = calcularMediaAjuizamento(arrayObjetosEnvolvidos, numMembrosFamilia);
    const mediaRequerimento = calcularMediaRequerimento(arrayObjetosEnvolvidos, numMembrosFamilia);

    console.log('Média Ajuizamento:', mediaAjuizamento);
    console.log('Média Requerimento:', mediaRequerimento);

    const anoAjuizamento = removeDayMonthFromDate(infoRequerente.dataAjuizamento)
    const anoRequerimento = removeDayMonthFromDate(infoRequerente.dataRequerimento)

    const arraySalarioMinimoAjuizamento = await getSalarioMinimo(anoAjuizamento);
    const arraySalarioMinimoRequerimento = await getSalarioMinimo(anoRequerimento);
    
    salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[0].valor)
    salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[0].valor)
    
    if (anoAjuizamento === "2023") {
        const mesAjuizamento = removeDayYearFromDate(infoRequerente.dataAjuizamento)
    
        if (mesAjuizamento === '01' || mesAjuizamento === '02' || mesAjuizamento === '03' || mesAjuizamento === '04') {
            salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[0].valor)
        } else {
            salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[1].valor)
        }
    
    }
                        
    if (anoRequerimento === "2023") {
        const mesRequerimento = removeDayYearFromDate(infoRequerente.dataRequerimento)
    
        if (mesRequerimento === '01' || mesRequerimento === '02' || mesRequerimento === '03' || mesRequerimento === '04') {
            salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[0].valor)
        } else {
            salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[1].valor)
        }
    
    }

    console.log(`Salário mínimo de ${anoAjuizamento}: ${salarioMinimoAjz}`)
    console.log(`Salário mínimo de ${anoRequerimento}: ${salarioMinimoReq}`)


    return compararPrioridadeRenda(mediaAjuizamento, mediaRequerimento, salarioMinimoAjz, salarioMinimoReq);
}

function compararPrioridadeRenda(mediaAjuizamento: number, mediaRequerimento: number, salarioMinimoAjuizamento: number, salarioMinimoRequerimento: number) {
    const limiteBaixaAjz = salarioMinimoAjuizamento / 4;
    const limiteMediaAjz = salarioMinimoAjuizamento / 2;
    const limiteAltaAjz = salarioMinimoAjuizamento;

    const limiteBaixaReq = salarioMinimoRequerimento / 4;
    const limiteMediaReq = salarioMinimoRequerimento / 2;
    const limiteAltaReq = salarioMinimoRequerimento;

    let flagAjuizamento: string = '';
    let flagRequerimento: string = '';

    if (mediaAjuizamento > limiteAltaAjz) {
        flagAjuizamento = 'ELEVADA';
    } else if (mediaAjuizamento > limiteMediaAjz && mediaAjuizamento <= limiteAltaAjz) {
        flagAjuizamento = 'ALTA';
    } else if (mediaAjuizamento > limiteBaixaAjz && mediaAjuizamento <= limiteMediaAjz) {
        flagAjuizamento = 'MEDIA';
    }


    if (mediaRequerimento > limiteAltaReq) {
        flagRequerimento = 'ELEVADA';
    } else if (mediaRequerimento > limiteMediaReq && mediaRequerimento <= limiteAltaReq) {
        flagRequerimento = 'ALTA';
    } else if (mediaRequerimento > limiteBaixaReq && mediaRequerimento <= limiteMediaReq) {
        flagRequerimento = 'MEDIA';
    }

    return compararPrioridade(flagAjuizamento, flagRequerimento);
}

