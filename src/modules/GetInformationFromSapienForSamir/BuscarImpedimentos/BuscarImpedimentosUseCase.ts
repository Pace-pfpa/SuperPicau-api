import { IInformacoesProcessoDTO } from "../../../DTO/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../../../DTO/IInformacoesProcessoLoasDTO";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosRM } from "../../../DTO/IObjInfoImpeditivosRM";
import { arrayInteressados } from "../../CreateInterested/Helps/ArrayInteressados";
import { GetInteressadosReq } from "../../CreateInterested/RequisicaoAxiosTarefas/GetInteressadosReq";
import { getInformationCapa } from "../GetInformationCapa";
import { getInfoReqDossieNormal } from "../helps/getInfoReqDossieNormal";
import { getInfoReqDossieSuper } from "../helps/getInfoReqDossieSuper";
import { verificarDossieMaisAtual } from "../helps/verificarDossieMaisAtual";
import { normalDossieClass, superDossieClass } from "../Refactor/classes";
import { calcularRendaFamiliar } from "./calculoLoas/calcularRendaFamiliar";
import { etiquetarRenda } from "./calculoLoas/etiquetarRenda";
import { montarObjetosEnvolvidos } from "./calculoLoas/montarObjetosEnvolvidos";
import { impedimentosSislabraLOAS } from "./sislabraImpedimentos/impedimentosSislabraLOAS";
import { impedimentosSislabraRuralMaternidade } from "./sislabraImpedimentos/impedimentosSislabraRuralMaternidade";

export class BuscarImpedimentosUseCase {

    async procurarImpedimentos(informacoesProcesso: IInformacoesProcessoDTO): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const {
            cookie,
            tipo_triagem,
            capaFormatada,
            dosprevPoloAtivo,
            isDosprevPoloAtivoNormal,
            sislabraPoloAtivo,
            sislabraConjuge
        } = informacoesProcesso;

        const impedimentoCapa: string[] = [];
        const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
        if(!informationcapa){
            impedimentoCapa.push("ADVOGADO");
        }

        const impedimentosSislabra = await impedimentosSislabraRuralMaternidade(sislabraPoloAtivo, sislabraConjuge, cookie);

        if (tipo_triagem === 0) {

            if (isDosprevPoloAtivoNormal) {  
                const impedimentosBusca = await normalDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra];
                console.log("RURAL NORMAL")
                console.log(impedimentos)

                return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos }
            } else {
                const impedimentosBusca = await superDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra];
                console.log("RURAL SUPER")
                console.log(impedimentos)

                return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos }
            }
        } else {

            if (isDosprevPoloAtivoNormal) {
                const impedimentosBusca = await normalDossieClass.burcarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra];
                console.log("MATERNIDADE NORMAL")
                console.log(impedimentos)

                return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos }
            } else {
                const impedimentosBusca = await superDossieClass.buscarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca.impedimentos, ...impedimentosSislabra];
                console.log("MATERNIDADE SUPER")
                console.log(impedimentos)

                return { impedimentos, objImpedimentos: impedimentosBusca.objImpedimentos }
            }
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
            let dossie = await verificarDossieMaisAtual(cpf, cookie, arrayDeDossiesNormais, arrayDeDossiesSuper);
            if (dossie instanceof Error || !dossie) {
                console.error(`ERRO DOSPREV ENVOLVIDO CPF: ${cpf}`);
            } else {
                if (dossie[1] === 0) {
                    arrayDossieEnvolvidosNormal.push(dossie[0]);
                } else if (dossie[1] === 1) {
                    arrayDossieEnvolvidosSuper.push(dossie[0]);
                }
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
