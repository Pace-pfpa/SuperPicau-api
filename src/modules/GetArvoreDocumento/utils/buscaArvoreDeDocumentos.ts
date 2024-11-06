import { getArvoreDocumentoUseCase } from "..";
import { IGetArvoreDocumentoDTO, ResponseArvoreDeDocumento } from "../DTO";

export async function buscarArvoreDeDocumentos(objectGetArvoreDocumento: IGetArvoreDocumentoDTO): Promise<ResponseArvoreDeDocumento[] | Error> {
    try {
        return (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
    } catch (error) {
        console.log("Erro ao aplicar getArvoreDocumentoUseCase!!!!");
        console.log(error)
        return new Error("DOSPREV COM FALHA NA PESQUISA");
    }
}
