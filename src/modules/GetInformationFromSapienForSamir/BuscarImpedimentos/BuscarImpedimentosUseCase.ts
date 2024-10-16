import { IInformacoesProcessoDTO } from "../../../DTO/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../../../DTO/IInformacoesProcessoLoasDTO";

export class BuscarImpedimentosUseCase {

    async procurarImpedimentos(informacoesProcesso: IInformacoesProcessoDTO): Promise<any> {
        // Lógica para buscar impedimentos com base nas informações do processo
        // Aqui você terá acesso ao objeto `processInfo` retornado pelo método `execute`

        return {
            message: "Impedimentos processados com sucesso"
        };
    }

    async procurarImpedimentosLOAS(informacoesProcesso: IInformacoesProcessoLoasDTO): Promise<any> {
        return {
            message: "Impedimentos processados com sucesso"
        };
    }
}
