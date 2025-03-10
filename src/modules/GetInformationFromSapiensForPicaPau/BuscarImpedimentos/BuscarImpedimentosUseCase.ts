import { getInformationCapa } from "../GetInformationCapa";
import { getInfoReqDossieNormal } from "../helps/renda.utils/normal/getInfoReqDossieNormal";
import { getInfoReqDossieSuper } from "../helps/renda.utils/super/getInfoReqDossieSuper";
import { normalDossieClass, superDossieClass } from "../classes";
import { impedimentosSislabraLOAS } from "./sislabraImpedimentos/impedimentosSislabraLOAS";
import { IInformacoesProcessoDTO, 
        IObjInfoImpeditivosMaternidade, 
        IResponseLabraAutorConjugeRural, 
        IInformacoesProcessoLoasDTO, 
        IObjInfoImpeditivosLoas, 
        IPicaPauCalculeDTO 
    } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { getGrupoFamiliarCpfs } from "./utils/getGrupoFamiliarCpfs";
import { getArrayObjetosEnvolvidos } from "./utils/getArrayObjetosEnvolvidos";
import { informationRenda } from "./utils/informationRenda";
import { IResponseLabraAutorGF } from "../dto/Sislabra/interfaces/IResponseLabraAutorGF";
import { impedimentosSislabraMaternidade } from "./sislabraImpedimentos/impedimentosSislabraMaternidade";
import { IResponseLabraAutorConjugeMaternidade } from "../dto/Sislabra/interfaces/maternidade/IResponseLabraAutorConjugeMaternidade";
import { impedimentosSislabraRural } from "./sislabraImpedimentos/impedimentosSislabraRuralMaternidade";

export class BuscarImpedimentosUseCase {
    async procurarImpedimentosMaternidade(
        informacoesProcesso: IInformacoesProcessoDTO
    ): Promise<{ 
        impedimentos: string[], 
        objImpedimentos: IObjInfoImpeditivosMaternidade, 
        objImpedimentosLabra: IResponseLabraAutorConjugeMaternidade
    }> {
        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(
            informacoesProcesso.capaFormatada
        );
        if (!informationcapa.encontrouAdvogado) impedimentoCapa.push("ADVOGADO");
        
        const impedimentosSislabra = await impedimentosSislabraMaternidade(
            informacoesProcesso.sislabra.sislabraPoloAtivo, 
            informacoesProcesso.sislabra.sislabraConjuge
        );
        const ObjImpedimentosLabraAutorConjuge: IResponseLabraAutorConjugeMaternidade = {
            autor: impedimentosSislabra.autor,
            conjuge: impedimentosSislabra.conjuge,
        }

        if (informacoesProcesso.dossie.isDosprevPoloAtivoNormal) {
            const impedimentosBusca = await normalDossieClass.burcarImpedimentosForMaternidade(
                informacoesProcesso.dossie.dossieFormatado, 
                informacoesProcesso.dossie.dossieExtractedPartial
            );

            const impedimentos = [
                ...impedimentoCapa, 
                ...impedimentosBusca.impedimentos, 
                ...impedimentosSislabra.impedimentos
            ];
            console.log("MATERNIDADE NORMAL")
            console.log(impedimentos)

            return { 
                impedimentos, 
                objImpedimentos: impedimentosBusca.objImpedimentos, 
                objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge 
            }
        } else {
            const impedimentosBusca = await superDossieClass.buscarImpedimentosForMaternidade(
                informacoesProcesso.dossie.dossieFormatado, 
                informacoesProcesso.dossie.dossieExtractedPartial
            );

            const impedimentos = [
                ...impedimentoCapa, 
                ...impedimentosBusca.impedimentos, 
                ...impedimentosSislabra.impedimentos
            ];
            console.log("MATERNIDADE SUPER")
            console.log(impedimentos)

            return { 
                impedimentos, 
                objImpedimentos: impedimentosBusca.objImpedimentos, 
                objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge 
            }
        }
        
    }

    async procurarImpedimentosRural(
        informacoesProcesso: IInformacoesProcessoDTO
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRural, objImpedimentosLabra: IResponseLabraAutorConjugeRural }> {
        const {
            cookie,
            capaFormatada
        } = informacoesProcesso;

        const sislabraPoloAtivo = informacoesProcesso.sislabra.sislabraPoloAtivo;
        const sislabraConjuge = informacoesProcesso.sislabra.sislabraConjuge;
        const dosprevPoloAtivo = informacoesProcesso.dossie.dosprevPoloAtivo;
        const isDosprevPoloAtivoNormal = informacoesProcesso.dossie.isDosprevPoloAtivoNormal;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
        if (!informationcapa.encontrouAdvogado) {
            impedimentoCapa.push("ADVOGADO");
        }

        const impedimentosSislabra = await impedimentosSislabraRural(sislabraPoloAtivo, sislabraConjuge);
        const ObjImpedimentosLabraAutorConjuge: IResponseLabraAutorConjugeRural = {
            autor: impedimentosSislabra.autor,
            conjuge: impedimentosSislabra.conjuge
        }
        
        if (isDosprevPoloAtivoNormal) {
            const impedimentosBusca = await normalDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

            const impedimentos = [...impedimentoCapa, ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("RURAL NORMAL")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        } else {
            const impedimentosBusca = await superDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

            const impedimentos = [...impedimentoCapa, ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("RURAL SUPER")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        }
    }

    async procurarImpedimentosLOAS(
        informacoesProcesso: IInformacoesProcessoLoasDTO
    ): Promise<{ 
        impedimentos: string[], 
        objImpedimentos: IObjInfoImpeditivosLoas, 
        objImpedimentosLabra: IResponseLabraAutorGF 
    }> {
        let impedimentosBusca: { 
            impedimentos: string[], 
            objImpedimentos: IObjInfoImpeditivosLoas 
        };
        let grupoFamiliar: string[] = [];
        let impedimentoRenda: string[] = [];
        let infoRequerente: IPicaPauCalculeDTO;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(
            informacoesProcesso.capaFormatada
        );
        if (!informationcapa) impedimentoCapa.push("ADVOGADO");

        const impedimentosSislabra = await impedimentosSislabraLOAS(
            informacoesProcesso.sislabra.sislabraPoloAtivo, 
            informacoesProcesso.sislabra.sislabraGFInfo,
        );
        
        const ObjImpedimentosLabraAutorGF: IResponseLabraAutorGF = {
            autor: impedimentosSislabra.autor,
            gf: impedimentosSislabra.gf
        }

        if (informacoesProcesso.dossie.isDosprevPoloAtivoNormal) {
            impedimentosBusca = await normalDossieClass.buscarImpedimentosForLoas(
                informacoesProcesso.dossie.dossieExtractedPartial
            );
            infoRequerente = await getInfoReqDossieNormal(
                informacoesProcesso.dossie.dossieExtractedPartial,
                informacoesProcesso.dossie.dossieFormatado
            );
        } else {
            impedimentosBusca = await superDossieClass.buscarImpedimentosForLOAS(
                informacoesProcesso.dossie.dossieExtractedPartial
            );
            infoRequerente = await getInfoReqDossieSuper(
                informacoesProcesso.dossie.dossieExtractedPartial,
                informacoesProcesso.dossie.dossieFormatado
            );
        }

        if (!informacoesProcesso.dossieSocialInfo) {
            impedimentoCapa.push("CADÚNICO");
        } else if (
            impedimentosBusca.objImpedimentos.requerimento
        ) {
            console.warn("AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -> NÃO CALCULAR A RENDA");
        } else {
            grupoFamiliar = await getGrupoFamiliarCpfs(
                informacoesProcesso.tarefaPastaID,
                informacoesProcesso.cookie,
                informacoesProcesso.cpfCapa,
                informacoesProcesso.dossieSocialInfo
            );
            let arrayObjetosEnvolvidos = await getArrayObjetosEnvolvidos(
                grupoFamiliar,
                infoRequerente,
                informacoesProcesso.cookie,
                informacoesProcesso.dossie.arrayDeDossiesNormais,
                informacoesProcesso.dossie.arrayDeDossiesSuper
            );
            const { impeditivo, objImpeditivoRenda } = await informationRenda(
                arrayObjetosEnvolvidos,
                grupoFamiliar,
                infoRequerente
            );
            impedimentoRenda = impeditivo;
            impedimentosBusca.objImpedimentos = { ...impedimentosBusca.objImpedimentos, renda: impedimentoRenda.length > 0 ? objImpeditivoRenda : null };
        }

        const impedimentos = [...impedimentoCapa, ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos, ...impedimentoRenda];
        console.log("LOAS")
        console.log(impedimentos)

        return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorGF }
    }
}
