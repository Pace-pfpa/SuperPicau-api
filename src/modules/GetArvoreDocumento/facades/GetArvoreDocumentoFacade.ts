import { getArvoreDocumentoUseCase,
         GetArvoreDocumentoDTO, 
         ResponseArvoreDeDocumentoDTO } from "..";

export async function GetArvoreDocumentoFacade(objectGetArvoreDocumento: GetArvoreDocumentoDTO): Promise<ResponseArvoreDeDocumentoDTO[] | Error> {
    try {
        return (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
    } catch (error) {
        return new Error("DOSPREV COM FALHA NA PESQUISA");
    }
}
