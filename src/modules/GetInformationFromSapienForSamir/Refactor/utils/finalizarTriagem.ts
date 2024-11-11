import { IInformacoesProcessoDTO } from "../../../../DTO/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../../../../DTO/IInformacoesProcessoLoasDTO";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosRM } from "../../../../DTO/IObjInfoImpeditivosRM";
import { IResponseLabraAutorConjuge } from "../../../../DTO/IResponseSislabra";
import { atualizarEtiquetaImpeditivo } from "./atualizarEtiquetaImpeditivo";
import { atualizarEtiquetaProcessoLimpo } from "./atualizarEtiquetaProcessoLimpo";
import { subirMinuta } from "./subirMinuta";

export async function finalizarTriagem(
    impeditivos: string[], 
    impeditivosLabrasRM: IResponseLabraAutorConjuge,
    impeditivosLabrasLoas: any,
    impeditivosDosprevRM: IObjInfoImpeditivosRM,
    impeditivosDosprevLoas: IObjInfoImpeditivosLoas,
    informacoesProcesso: IInformacoesProcessoDTO | IInformacoesProcessoLoasDTO): Promise<{ impeditivos: boolean }> {

    if (informacoesProcesso.isUserAdmin) {
        try {
            await subirMinuta(informacoesProcesso, impeditivos, impeditivosLabrasRM, impeditivosDosprevRM);
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error("Erro na função finalizarTriagem ao subir a minuta:", error);
        }
    }


    if (isProcessoLimpo(impeditivos)) {
        await atualizarEtiquetaProcessoLimpo(informacoesProcesso.cookie, informacoesProcesso.tarefaId);
        return {impeditivos: true}
    } else {

        const isRural = impeditivos.find(imp => imp.includes('*RURAL*'));
        const isMaternidade = impeditivos.find(imp => imp.includes('*MATERNIDADE*'));
        const isLOAS = impeditivos.find(imp => imp.includes('*LOAS*'));

        const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
        
        const impeditivosString = relevantes.join(' - ');

        if (isRural) {
            await atualizarEtiquetaImpeditivo(informacoesProcesso.cookie, `RURAL IMPEDITIVOS: ${impeditivosString}`, informacoesProcesso.tarefaId);
        } else if (isMaternidade) {
            await atualizarEtiquetaImpeditivo(informacoesProcesso.cookie, `MATERNIDADE IMPEDITIVOS: ${impeditivosString}`, informacoesProcesso.tarefaId);
        } else if (isLOAS) {
            await atualizarEtiquetaImpeditivo(informacoesProcesso.cookie, `LOAS IMPEDITIVOS: ${impeditivosString}`, informacoesProcesso.tarefaId);
        }

        return {impeditivos: false}
    }
    
}

function isProcessoLimpo(impeditivos: string[]): boolean {
    const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
    return relevantes.length === 0;
}