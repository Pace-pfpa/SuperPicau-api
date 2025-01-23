import { getInformationCapa } from "../GetInformationCapa";
import { getInfoReqDossieNormal } from "../helps/renda.utils/normal/getInfoReqDossieNormal";
import { getInfoReqDossieSuper } from "../helps/renda.utils/super/getInfoReqDossieSuper";
import { normalDossieClass, superDossieClass } from "../classes";
import { impedimentosSislabraLOAS } from "./sislabraImpedimentos/impedimentosSislabraLOAS";
import { impedimentosSislabraRuralMaternidade } from "./sislabraImpedimentos/impedimentosSislabraRuralMaternidade";
import { IInformacoesProcessoDTO, IObjInfoImpeditivosMaternidade, IResponseLabraAutorConjuge, IInformacoesProcessoLoasDTO, IObjInfoImpeditivosLoas, IPicaPauCalculeDTO } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { getGrupoFamiliarCpfs } from "./utils/getGrupoFamiliarCpfs";
import { getArrayObjetosEnvolvidos } from "./utils/getArrayObjetosEnvolvidos";
import { informationRenda } from "./utils/informationRenda";
import { IResponseLabraAutorGF } from "../dto/Sislabra/interfaces/IResponseLabraAutorGF";

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

            const impedimentos = [...impedimentoCapa, ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
            console.log("MATERNIDADE NORMAL")
            console.log(impedimentos)

            return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorConjuge }
        } else {
            const impedimentosBusca = await superDossieClass.buscarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

            const impedimentos = [...impedimentoCapa, ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos];
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
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas, objImpedimentosLabra: IResponseLabraAutorGF }> {
        const {
            tarefaPastaID,
            cookie,
            capaFormatada,
            cpfCapa,
            dosprevPoloAtivo,
            isDosprevPoloAtivoNormal,
            sislabraPoloAtivo,
            sislabraGFInfo,
            arrayDeDossiesNormais,
            arrayDeDossiesSuper,
            dossieSocialInfo
        } = informacoesProcesso;

        let impedimentosBusca: { impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas };
        let grupoFamiliar: string[] = [];
        let impedimentoRenda: string[] = [];
        let infoRequerente: IPicaPauCalculeDTO;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
        if (!informationcapa) {
            impedimentoCapa.push("ADVOGADO");
        }

        const impedimentosSislabra = await impedimentosSislabraLOAS(sislabraPoloAtivo, sislabraGFInfo, cookie);
        const ObjImpedimentosLabraAutorGF: IResponseLabraAutorGF = {
            autor: impedimentosSislabra.autor,
            gf: impedimentosSislabra.gf
        }

        if (isDosprevPoloAtivoNormal) {
            impedimentosBusca = await normalDossieClass.buscarImpedimentosForLoas(dosprevPoloAtivo, cookie);
            infoRequerente = await getInfoReqDossieNormal(cookie, dosprevPoloAtivo);
        } else {
            impedimentosBusca = await superDossieClass.buscarImpedimentosForLOAS(dosprevPoloAtivo, cookie);
            infoRequerente = await getInfoReqDossieSuper(cookie, dosprevPoloAtivo);
        }

        if (!dossieSocialInfo) {
            impedimentoCapa.push("CADÚNICO");
        } else {
            grupoFamiliar = await getGrupoFamiliarCpfs(tarefaPastaID, cookie, cpfCapa, dossieSocialInfo);
            let arrayObjetosEnvolvidos = await getArrayObjetosEnvolvidos(grupoFamiliar, infoRequerente, cookie, arrayDeDossiesNormais, arrayDeDossiesSuper);
            const { impeditivo, objImpeditivoRenda } = await informationRenda(arrayObjetosEnvolvidos, grupoFamiliar, infoRequerente);
            impedimentoRenda = impeditivo;
            impedimentosBusca.objImpedimentos = { ...impedimentosBusca.objImpedimentos, renda: impedimentoRenda.length > 0 ? objImpeditivoRenda : null };
        }

        const impedimentos = [...impedimentoCapa, ...impedimentosBusca.impedimentos, ...impedimentosSislabra.impedimentos, ...impedimentoRenda];
        console.log("LOAS")
        console.log(impedimentos)

        return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos, objImpedimentosLabra: ObjImpedimentosLabraAutorGF }
    }
}
