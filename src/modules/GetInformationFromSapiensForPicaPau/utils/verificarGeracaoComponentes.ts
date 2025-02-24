import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { JSDOM } from 'jsdom';

export async function verificarGeracaoComponentes(documento: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<Error> {
    const idParaPesquisa = documento.documentoJuntado.componentesDigitais[0].id;

    try {
        const paginaDocumento = await getDocumentoUseCase.execute({ cookie, idDocument: idParaPesquisa });
        if (paginaDocumento instanceof Error) return paginaDocumento;
        const paginaFormatada = new JSDOM(paginaDocumento);

        const verifarSeFoiGeradoComFalha = (getXPathText(paginaFormatada, "/html/body/text()")).trim() === "Houve um problema na recuperação do componente digital! Tente novamente mais tarde!";
    
        if (verifarSeFoiGeradoComFalha) {
            return new Error('COMPONENTE DIGITAL COM FALHA NA GERAÇÃO');
        }

    } catch (error) {
        console.log("Dossiê com falha na geração.");
        return new Error("DOSPREV COM FALHA NA GERAÇÃO");
    }

    return null;
}