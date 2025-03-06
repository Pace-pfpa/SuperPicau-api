import { minutaLimpaClass, minutaSujaClass } from ".";
import { IFinalizarTriagem, IInformacoesProcessoDTO, IInformacoesProcessoLoasDTO, IObjInfoImpeditivosLoas, IObjInfoImpeditivosMaternidade, IResponseLabraAutorConjugeRural } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { IResponseLabraAutorGF } from "../dto/Sislabra/interfaces/IResponseLabraAutorGF";
import { IResponseLabraAutorConjugeMaternidade } from "../dto/Sislabra/interfaces/maternidade/IResponseLabraAutorConjugeMaternidade";
import { atualizarEtiquetaImpeditivo, atualizarEtiquetaProcessoLimpo, isProcessoLimpo } from "../utils";

export class FinalizarTriagem {
    async rural(
        impeditivos: string[], 
        impeditivosLabrasRural: IResponseLabraAutorConjugeRural,
        impeditivosDosprevRural: IObjInfoImpeditivosRural,
        informacoesProcessoRM: IInformacoesProcessoDTO
    ): Promise<IFinalizarTriagem> {
        
        if (isProcessoLimpo(impeditivos)) {
        
            if (informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaLimpaClass.ruralProcessoLimpo(informacoesProcessoRM);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta limpa (rural): ", error);
                }
            }
        
            await atualizarEtiquetaProcessoLimpo(informacoesProcessoRM.cookie, informacoesProcessoRM.tarefaId);
            return { resultadoTriagem: '3', resposta: 'PROCESSO LIMPO' }
        } else {
        
            const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*'));
            const impeditivosString = relevantes.join(' - ');
        
            if (informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.ruralProcessoSujo(informacoesProcessoRM, impeditivosDosprevRural, impeditivosLabrasRural, impeditivos);
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (rural): ", error);
                }
            }
        
            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `RURAL IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
            return { resultadoTriagem: '1', resposta: 'IMPEDITIVOS' }
        }
    }

    async maternidade(
        impeditivos: string[], 
        impeditivosLabrasMaternidade: IResponseLabraAutorConjugeMaternidade,
        impeditivosDosprevMaternidade: IObjInfoImpeditivosMaternidade,
        informacoesProcessoRM: IInformacoesProcessoDTO
    ): Promise<IFinalizarTriagem> {

        if (isProcessoLimpo(impeditivos)) {

            if (informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaLimpaClass.maternidadeProcessoLimpo(informacoesProcessoRM);
                    await new Promise(resolve => setTimeout(resolve, 5000));    
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta limpa (maternidade): ", error);
                }
            }

            await atualizarEtiquetaProcessoLimpo(informacoesProcessoRM.cookie, informacoesProcessoRM.tarefaId);
            return { resultadoTriagem: '3', resposta: 'PROCESSO LIMPO' }
        } else {

            const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*MATERNIDADE*'));
            const impeditivosString = relevantes.join(' - ');

            if (informacoesProcessoRM.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.maternidadeProcessoSujo(
                        informacoesProcessoRM, 
                        impeditivosDosprevMaternidade, 
                        impeditivosLabrasMaternidade, 
                        impeditivos
                    );
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (maternidade): ", error);
                }
            }

            await atualizarEtiquetaImpeditivo(informacoesProcessoRM.cookie, `MATERNIDADE IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoRM.tarefaId);
            return { resultadoTriagem: '1', resposta: 'IMPEDITIVOS' }
        }
    }

    async loas(
        impeditivos: string[],
        impeditivosLabrasLoas: IResponseLabraAutorGF,
        impeditivosDosprevLoas: IObjInfoImpeditivosLoas,
        informacoesProcessoLoas: IInformacoesProcessoLoasDTO
    ): Promise<IFinalizarTriagem> {
        if (isProcessoLimpo(impeditivos)) {
            if (informacoesProcessoLoas.infoUpload.subirMinuta) {
                try {
                    await minutaLimpaClass.loasProcessoLimpo(informacoesProcessoLoas);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta limpa (loas): ", error);
                }
            }

            await atualizarEtiquetaProcessoLimpo(informacoesProcessoLoas.cookie, informacoesProcessoLoas.tarefaId);
            return { resultadoTriagem: '3', resposta: 'PROCESSO LIMPO' }
        } else {
            const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*LOAS*'));
            const impeditivosString = relevantes.join(' - ');

            if (informacoesProcessoLoas.infoUpload.subirMinuta) {
                try {
                    await minutaSujaClass.loasProcessoSujo(informacoesProcessoLoas, impeditivosDosprevLoas, impeditivosLabrasLoas, impeditivos);
                } catch (error) {
                    console.error("Erro na função finalizarTriagem ao subir a minuta suja (loas): ", error);
                }
            }

            await atualizarEtiquetaImpeditivo(informacoesProcessoLoas.cookie, `LOAS IMPEDITIVOS: ${impeditivosString}`, informacoesProcessoLoas.tarefaId);
            return { resultadoTriagem: '1', resposta: 'IMPEDITIVOS' }
        }
    }
}
