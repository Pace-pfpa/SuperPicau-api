import { getArvoreDocumentoUseCase,
         GetArvoreDocumentoDTO, 
         ResponseArvoreDeDocumentoDTO } from "..";

export async function GetArvoreDocumentoFacade(objectGetArvoreDocumento: GetArvoreDocumentoDTO): Promise<ResponseArvoreDeDocumentoDTO[]> {
    try {
        return (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
    } catch (error) {
        throw new Error("DOSPREV COM FALHA NA PESQUISA");
    }
}
