import { minutaClass } from "../classes";
import { IInformacoesProcessoLoasDTO, IObjInfoImpeditivosLoas, IResponseLabraAutorConjuge } from "../dto";
import { atualizarEtiquetaImpeditivo } from "./atualizarEtiquetaImpeditivo";
import { atualizarEtiquetaProcessoLimpo } from "./atualizarEtiquetaProcessoLimpo";
import { isProcessoLimpo } from "./isProcessoLimpo";

export async function finalizarTriagemLoas(
    impeditivos: string[], 
    impeditivosLabrasLoas: IResponseLabraAutorConjuge,
    impeditivosDosprevLoas: IObjInfoImpeditivosLoas,
    informacoesProcessoLoas: IInformacoesProcessoLoasDTO): Promise<{ impeditivos: boolean }> {

    if (isProcessoLimpo(impeditivos)) {

        if (informacoesProcessoLoas.isUserAdmin) {
            try {
                await minutaClass.loasProcessoLimpo(informacoesProcessoLoas);
                await new Promise(resolve => setTimeout(resolve, 5000));    
            } catch (error) {
                console.error("Erro na função finalizarTriagem ao subir a minuta:", error);
            }
        }

        await atualizarEtiquetaProcessoLimpo(informacoesProcessoLoas.cookie, informacoesProcessoLoas.tarefaId);
        return {impeditivos: true}
    } else {

        const isLOAS = impeditivos.find(imp => imp.includes('*LOAS*'));

        const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
        
        const impeditivosString = relevantes.join(' - ');

        if (isLOAS) {
            await atualizarEtiquetaImpeditivo(informacoesProcessoLoas.cookie, `LOAS IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoLoas.tarefaId);
        }

        return {impeditivos: false}
    }
    
}
