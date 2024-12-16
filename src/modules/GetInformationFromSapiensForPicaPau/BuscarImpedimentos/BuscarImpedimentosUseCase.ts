import { arrayInteressados } from "../../CreateInterested/Helps/ArrayInteressados";
import { GetInteressadosReq } from "../../CreateInterested/RequisicaoAxiosTarefas/GetInteressadosReq";
import { getInformationCapa } from "../GetInformationCapa";
import { getInfoReqDossieNormal } from "../helps/getInfoReqDossieNormal";
import { getInfoReqDossieSuper } from "../helps/getInfoReqDossieSuper";
import { verificarDossieMaisAtual } from "../helps/verificarDossieMaisAtual";
import { normalDossieClass, superDossieClass } from "../classes";
import { calcularRendaFamiliar } from "./calculoLoas/calcularRendaFamiliar";
import { etiquetarRenda } from "./calculoLoas/etiquetarRenda";
import { montarObjetosEnvolvidos } from "./calculoLoas/montarObjetosEnvolvidos";
import { impedimentosSislabraLOAS } from "./sislabraImpedimentos/impedimentosSislabraLOAS";
import { impedimentosSislabraRuralMaternidade } from "./sislabraImpedimentos/impedimentosSislabraRuralMaternidade";
import { IInformacoesProcessoDTO, IObjInfoImpeditivosMaternidade, IResponseLabraAutorConjuge, IInformacoesProcessoLoasDTO, IObjInfoImpeditivosLoas } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";

export class BuscarImpedimentosUseCase {

    async procurarImpedimentosMaternidade(
        informacoesProcesso: IInformacoesProcessoDTO
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosMaternidade, objImpedimentosLabra: IResponseLabraAutorConjuge }> {
        const {
            cookie,
            capaFormatada,
            dosprevPoloAtivo,
            isDosprevPoloAtivoNormal,
            sislabraPoloAtivo,
            sislabraConjuge
        } = informacoesProcesso;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
        if (!informationcapa.encontrouAdvogado) {
            impedimentoCapa.push("ADVOGADO");
        }

        const impedimentosSislabra = await impedimentosSislabraRuralMaternidade(sislabraPoloAtivo, sislabraConjuge, cookie);
        const ObjImpedimentosLabraAutorConjuge: IResponseLabraAutorConjuge = {
            autor: impedimentosSislabra.autor,
            conjuge: impedimentosSislabra.conjuge,
        }

        if (isDosprevPoloAtivoNormal) {
            const impedimentosBusca = await normalDossieClass.burcarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

            const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("MATERNIDADE NORMAL")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        } else {
            const impedimentosBusca = await superDossieClass.buscarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

            const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("MATERNIDADE SUPER")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        }
        
    }

    async procurarImpedimentosRural(
        informacoesProcesso: IInformacoesProcessoDTO
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRural, objImpedimentosLabra: IResponseLabraAutorConjuge }> {
        const {
            cookie,
            capaFormatada,
            dosprevPoloAtivo,
            isDosprevPoloAtivoNormal,
            sislabraPoloAtivo,
            sislabraConjuge
        } = informacoesProcesso;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
        if (!informationcapa.encontrouAdvogado) {
            impedimentoCapa.push("ADVOGADO");
        }

        const impedimentosSislabra = await impedimentosSislabraRuralMaternidade(sislabraPoloAtivo, sislabraConjuge, cookie);
        const ObjImpedimentosLabraAutorConjuge: IResponseLabraAutorConjuge = {
            autor: impedimentosSislabra.autor,
            conjuge: impedimentosSislabra.conjuge
        }
        
        if (isDosprevPoloAtivoNormal) {
            const impedimentosBusca = await normalDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

            const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("RURAL NORMAL")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        } else {
            const impedimentosBusca = await superDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

            const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("RURAL SUPER")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        }
    }

    async procurarImpedimentosLOAS(informacoesProcesso: IInformacoesProcessoLoasDTO): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        const {
            tarefaPastaID,
            cookie,
            capaFormatada,
            cpfCapa,
            dosprevPoloAtivo,
            isDosprevPoloAtivoNormal,
            sislabraPoloAtivo,
            sislabraGF,
            arrayDeDossiesNormais,
            arrayDeDossiesSuper,
            dossieSocialInfo
        } = informacoesProcesso;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
        if(!informationcapa){
            impedimentoCapa.push("ADVOGADO");
        }

        if (!dossieSocialInfo) {
            impedimentoCapa.push("CADÚNICO");
        }

        const impedimentosSislabra = await impedimentosSislabraLOAS(sislabraPoloAtivo, sislabraGF, cookie);

        let InputArray = await GetInteressadosReq(tarefaPastaID, cookie);
        let ArrayEnvolvidos = arrayInteressados(InputArray);

        let grupoFamiliarCpfs = dossieSocialInfo?.grupoFamiliarCpfs || [];
        let updated_cpf_dos_familiares2 = [...grupoFamiliarCpfs, ...ArrayEnvolvidos.filter(cpf => {
            return cpf !== '0000000000-' && cpf !== cpfCapa && cpf.length <= 11 && !grupoFamiliarCpfs.includes(cpf);
        })];

        console.log('---GRUPO FAMILIAR COMPLETO');
        console.log(updated_cpf_dos_familiares2)

        let arrayDossieEnvolvidosNormal = [];
        let arrayDossieEnvolvidosSuper = [];
        let infoRequerente;

        let impedimentosBusca: { impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas };

        if (isDosprevPoloAtivoNormal) {
            impedimentosBusca = await normalDossieClass.buscarImpedimentosForLoas(dosprevPoloAtivo, cookie);
            infoRequerente = await getInfoReqDossieNormal(cookie, dosprevPoloAtivo);
        } else {
            impedimentosBusca = await superDossieClass.buscarImpedimentosForLOAS(dosprevPoloAtivo, cookie);
            infoRequerente = await getInfoReqDossieSuper(cookie, dosprevPoloAtivo);
        }


        for (let cpf of updated_cpf_dos_familiares2) {
            try {
                const dossie = await verificarDossieMaisAtual(cpf, cookie, arrayDeDossiesNormais, arrayDeDossiesSuper);
                if (dossie instanceof Error || !dossie) {
                    console.error(`ERRO DOSPREV ENVOLVIDO CPF: ${cpf}`);
                    continue;
                }

                const [dossieId, tipoDossie] = dossie;
    
                if (tipoDossie === 0) {
                    arrayDossieEnvolvidosNormal.push(dossieId);
                } else if (tipoDossie === 1) {
                    arrayDossieEnvolvidosSuper.push(dossieId);
                }
            } catch (error) {
                console.error(`Erro inesperado ao processar CPF ${cpf}:`, error);
            }
        }

        let arrayObjetosEnvolvidos = await montarObjetosEnvolvidos(
            arrayDossieEnvolvidosNormal, 
            arrayDossieEnvolvidosSuper, 
            infoRequerente, 
            cookie
        );

        const resultadoRenda = await calcularRendaFamiliar(arrayObjetosEnvolvidos, updated_cpf_dos_familiares2.length + 1, infoRequerente);
        const impedimentoRenda: string[] = await etiquetarRenda(resultadoRenda);

        const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra, ...(impedimentoRenda || [])];
        console.log("LOAS")
        console.log(impedimentos)

        return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos }
    }
}
