import { getDocumentoUseCase } from "../../../GetDocumento";
import { cadUnico } from "../../loas/CadUnico";
const { JSDOM } = require('jsdom');

export async function buscarDossieSocial(arvoreDeDocumentos: any, cookie: string, cpfCapa: string) {

    let dossieSocialInfo = null;
    const dossieSocial = arvoreDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla === "DOSOC");

    if (dossieSocial) {

        try {
            const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
            const paginaDossieSocial = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });
            const paginaDossieSocialFormatada = new JSDOM(paginaDossieSocial);
            const medicamentos = await cadUnico.execute(paginaDossieSocialFormatada);

            const gastoComMedicamentos = medicamentos !== '0.00';
            const grupoFamiliarCpfs = await cadUnico.grupoFamiliar(paginaDossieSocialFormatada, cpfCapa);

            dossieSocialInfo = { gastoComMedicamentos, grupoFamiliarCpfs };
        } catch (error) {
            console.log("Erro ao buscar dossie social");
            throw new Error("DOSPREV COM FALHA NA GERAÇÃO");
        } 
    }

    return dossieSocialInfo;
}