import { IInformacoesProcessoDTO } from "../../../DTO/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../../../DTO/IInformacoesProcessoLoasDTO";
import { superDossie } from "../DossieSuperSapiens";
import { getInformationCapa } from "../GetInformationCapa";
import { normalDossieClass, superDossieClass } from "../Refactor/classes";

export class BuscarImpedimentosUseCase {

    async procurarImpedimentos(informacoesProcesso: IInformacoesProcessoDTO): Promise<any> {
        const {
            usuario_id,
            cookie,
            tipo_triagem,
            capaFormatada,
            cpfCapa,
            arrayDeDocumentos,
            dosprevPoloAtivo,
            isDosprevPoloAtivoNormal
        } = informacoesProcesso;

        if (tipo_triagem === 0) {

            const impedimentoCapa: string[] = [];
            const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
            if(!informationcapa){
                impedimentoCapa.push("ADVOGADO");
            }

            if (isDosprevPoloAtivoNormal) {  
                const impedimentosBusca = await normalDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca];
                console.log("RURAL NORMAL")
                console.log(impedimentos)

                return impedimentos;
            } else {
                const impedimentosBusca = await superDossieClass.buscarImpedimentosForRural(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca];
                console.log("RURAL SUPER")
                console.log(impedimentos)

                return impedimentos;
            }
        } else {

            const impedimentoCapa: string[] = null;
            const informationcapa = await getInformationCapa.ImpedimentosCapa(capaFormatada);
            if(!informationcapa){
                impedimentoCapa.push("ADVOGADO");
            }

            if (isDosprevPoloAtivoNormal) {
                const impedimentosBusca = await normalDossieClass.burcarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca];
                console.log("MATERNIDADE NORMAL")
                console.log(impedimentos)
            } else {
                const impedimentosBusca = await superDossieClass.buscarImpedimentosForMaternidade(dosprevPoloAtivo, cookie);

                const impedimentos = [...(impedimentoCapa || []), ...impedimentosBusca];
                console.log("MATERNIDADE SUPER")
                console.log(impedimentos)

                return impedimentos;
            }
        }
    }

    async procurarImpedimentosLOAS(informacoesProcesso: IInformacoesProcessoLoasDTO): Promise<any> {
        return {
            message: "Impedimentos processados com sucesso"
        };
    }
}
