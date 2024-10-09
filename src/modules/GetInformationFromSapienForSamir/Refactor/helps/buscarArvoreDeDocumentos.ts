import { IGetArvoreDocumentoDTO } from "../../../../DTO/GetArvoreDocumentoDTO";
import { ResponseArvoreDeDocumento } from "../../../../sapiensOperations/response/ResponseArvoreDeDocumento";
import { getArvoreDocumentoUseCase } from "../../../GetArvoreDocumento";

export async function buscarArvoreDeDocumentos(objectGetArvoreDocumento: IGetArvoreDocumentoDTO): Promise<ResponseArvoreDeDocumento[]> {
    try {
        return (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
    } catch (error) {
        console.log("Erro ao aplicar getArvoreDocumentoUseCase!!!!");
        throw new Error("DOSPREV COM FALHA NA PESQUISA");
    }
}
