import { IPicaPauCalculeDTO } from "../../dto";
import { calcularMediaAjuizamento } from "../../helps/calcularMediaAjuizamento";
import { calcularMediaRequerimento } from "../../helps/calcularMediaRequerimento";
import { removeDayMonthFromDate } from "../../helps/removeDayMonthFromDate";
import { removeDayYearFromDate } from "../../helps/removeDayYearFromDate";
import { compararPrioridade } from "../../loas/Business/Help/compareRenda";
import { getSalarioMinimo } from "../../loas/Business/Help/getSalarioMinimo";
import { DetalhesRenda } from "./dto/DetalhesRenda";

export async function calcularRendaFamiliar(
    arrayObjetosEnvolvidos: IPicaPauCalculeDTO[], 
    numMembrosFamilia: number, 
    infoRequerente: IPicaPauCalculeDTO
): Promise<{ impeditivo: string; detalhesRenda: DetalhesRenda }> {
    let salarioMinimoAjz: number = 0;
    let salarioMinimoReq: number = 0;

    const mediaAjuizamento = calcularMediaAjuizamento(arrayObjetosEnvolvidos, numMembrosFamilia);
    const mediaRequerimento = calcularMediaRequerimento(arrayObjetosEnvolvidos, numMembrosFamilia);

    const anoAjuizamento = removeDayMonthFromDate(infoRequerente.dataAjuizamento)
    const anoRequerimento = removeDayMonthFromDate(infoRequerente.dataRequerimento)

    const arraySalarioMinimoAjuizamento = await getSalarioMinimo(anoAjuizamento);
    const arraySalarioMinimoRequerimento = await getSalarioMinimo(anoRequerimento);
    
    salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[0].valor)
    salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[0].valor)
    
    if (anoAjuizamento === "2023") {
        const mesAjuizamento = removeDayYearFromDate(infoRequerente.dataAjuizamento)
    
        if (["01", "02", "03", "04"].includes(mesAjuizamento)) {
            salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[0].valor);
        } else {
            salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[1].valor);
        }
    
    }
                        
    if (anoRequerimento === "2023") {
        const mesRequerimento = removeDayYearFromDate(infoRequerente.dataRequerimento);

        if (["01", "02", "03", "04"].includes(mesRequerimento)) {
            salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[0].valor);
        } else {
            salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[1].valor);
        }
    }

    console.log(`Salário mínimo de ${anoAjuizamento}: ${salarioMinimoAjz}`)
    console.log(`Salário mínimo de ${anoRequerimento}: ${salarioMinimoReq}`)
    console.log('Média Ajuizamento:', mediaAjuizamento);
    console.log('Média Requerimento:', mediaRequerimento);

    const fallbackInfo: {
        nome: string;
        cpf: string;
        fallbackRemuneracao: number;
        fallbackDate: string;
    }[] = [];

    for (const membro of [...arrayObjetosEnvolvidos, infoRequerente]) {
        if (membro.isFallback && membro.fallbackInfo) {
            fallbackInfo.push({
                nome: membro.nome,
                cpf: membro.cpf,
                fallbackRemuneracao: membro.fallbackInfo.fallbackRemuneracao,
                fallbackDate: membro.fallbackInfo.fallbackDate,
            });
        }
    }

    const impeditivo = compararPrioridadeRenda(
        mediaAjuizamento, 
        mediaRequerimento, 
        salarioMinimoAjz, 
        salarioMinimoReq
    );

    const detalhesRenda: DetalhesRenda = {
        numMembrosFamilia,
        mediaAjuizamento,
        mediaRequerimento,
        salarioMinimoAjuizamento: salarioMinimoAjz,
        salarioMinimoRequerimento: salarioMinimoReq,
        isFallback: fallbackInfo.length > 0,
        fallbackInfo: fallbackInfo.length > 0 ? fallbackInfo : null,
    };

    return { impeditivo, detalhesRenda };
}

function compararPrioridadeRenda(
    mediaAjuizamento: number, 
    mediaRequerimento: number, 
    salarioMinimoAjuizamento: number, 
    salarioMinimoRequerimento: number
): string {
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

