import { minutaLimpaClass, minutaSujaClass } from ".";
import { IInformacoesProcessoDTO, IObjInfoImpeditivosMaternidade, IResponseLabraAutorConjuge } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { atualizarEtiquetaImpeditivo, atualizarEtiquetaProcessoLimpo, isProcessoLimpo } from "../utils";

export class FinalizarTriagem {
    async rural(
        impeditivos: string[], 
        impeditivosLabrasRM: IResponseLabraAutorConjuge,
        impeditivosDosprevRM: IObjInfoImpeditivosRural,
        informacoesProcessoRM: IInformacoesProcessoDTO
    ): Promise<{ impeditivos: boolean }> {
        
        if (isProcessoLimpo(impeditivos)) {
        
            if (informacoesProcessoRM.isUserAdmin && informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaLimpaClass.ruralProcessoLimpo(informacoesProcessoRM);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta limpa (rural): ", error);
                }
            }
        
            await atualizarEtiquetaProcessoLimpo(informacoesProcessoRM.cookie, informacoesProcessoRM.tarefaId);
            return { impeditivos: true }
        } else {
        
            const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*'));
            const impeditivosString = relevantes.join(' - ');
        
            if (informacoesProcessoRM.isUserAdmin && informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.ruralProcessoSujo(informacoesProcessoRM, impeditivosDosprevRM, impeditivosLabrasRM, impeditivos);
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (rural): ", error);
                }
            }
        
            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `RURAL IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
            return {impeditivos: false}
        }
    }

    async maternidade(
        impeditivos: string[], 
        impeditivosLabrasRM: IResponseLabraAutorConjuge,
        impeditivosDosprevRM: IObjInfoImpeditivosMaternidade,
        informacoesProcessoRM: IInformacoesProcessoDTO
    ): Promise<{ impeditivos: boolean }> {

        if (isProcessoLimpo(impeditivos)) {

            if (informacoesProcessoRM.isUserAdmin && informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaLimpaClass.maternidadeProcessoLimpo(informacoesProcessoRM);
                    await new Promise(resolve => setTimeout(resolve, 5000));    
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta limpa (maternidade): ", error);
                }
                
            }

            await atualizarEtiquetaProcessoLimpo(informacoesProcessoRM.cookie, informacoesProcessoRM.tarefaId);
            return { impeditivos: true }
        } else {

            const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*MATERNIDADE*'));
            const impeditivosString = relevantes.join(' - ');

            if (informacoesProcessoRM.isUserAdmin && informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.maternidadeProcessoSujo(informacoesProcessoRM, impeditivosDosprevRM, impeditivosLabrasRM, impeditivos);
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (maternidade): ", error);
                }
            }

            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `MATERNIDADE IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
            return { impeditivos: false }
        }
    }
}
