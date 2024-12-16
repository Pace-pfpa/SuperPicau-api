import { minutaSujaClass, minutaLimpaClass } from "../classes";
import { IInformacoesProcessoDTO, IObjInfoImpeditivosRM, IResponseLabraAutorConjuge } from "../dto";
import { atualizarEtiquetaImpeditivo } from "./atualizarEtiquetaImpeditivo";
import { atualizarEtiquetaProcessoLimpo } from "./atualizarEtiquetaProcessoLimpo";
import { isProcessoLimpo } from "./isProcessoLimpo";

export async function finalizarTriagemRM(
    impeditivos: string[], 
    impeditivosLabrasRM: IResponseLabraAutorConjuge,
    impeditivosDosprevRM: IObjInfoImpeditivosRM,
    informacoesProcessoRM: IInformacoesProcessoDTO): Promise<{ impeditivos: boolean }> {

    const isRural = informacoesProcessoRM.tipo_triagem === 0;
    const isMaternidade = informacoesProcessoRM.tipo_triagem === 1;

    if (isProcessoLimpo(impeditivos)) {

        if (informacoesProcessoRM.isUserAdmin && isMaternidade && informacoesProcessoRM.infoUpload.subirMinuta) {
            try {
                await minutaLimpaClass.maternidadeProcessoLimpo(informacoesProcessoRM);
                await new Promise(resolve => setTimeout(resolve, 5000));    
            } catch (error) {
                console.error("Erro na função finalizarTriagem ao subir a minuta limpa (maternidade): ", error);
            }
            
        } else if (informacoesProcessoRM.isUserAdmin && isRural && informacoesProcessoRM.infoUpload.subirMinuta) {
            try {
                await minutaLimpaClass.ruralProcessoLimpo(informacoesProcessoRM);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (error) {
                console.error("Erro na função finalizarTriagem ao subir a minuta limpa (rural): ", error);
            }
        }

        await atualizarEtiquetaProcessoLimpo(informacoesProcessoRM.cookie, informacoesProcessoRM.tarefaId);
        return {impeditivos: true}
        
    } else {

        const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*'));
        
        const impeditivosString = relevantes.join(' - ');

        if (isRural) {

            if (informacoesProcessoRM.isUserAdmin && informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.ruralProcessoSujo(informacoesProcessoRM, impeditivosDosprevRM, impeditivosLabrasRM, impeditivos);
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (rural): ", error);
                }
            }

            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `RURAL IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
        } else if (isMaternidade) {

            if (informacoesProcessoRM.isUserAdmin && informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.maternidadeProcessoSujo(informacoesProcessoRM, impeditivosDosprevRM, impeditivosLabrasRM, impeditivos);
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (maternidade): ", error);
                }
            }

            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `MATERNIDADE IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
        }

        return {impeditivos: false}
    }
    
}
