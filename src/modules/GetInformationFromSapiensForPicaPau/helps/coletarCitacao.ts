import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";

export function coletarCitacao(arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[]): string {
    const ObjectCitacao = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.nome == "CITAÇÃO");
    if (ObjectCitacao == null) {
        return null
    }
    const ArrayDataCitacaoParaFormatacao = ObjectCitacao.documentoJuntado.dataHoraProducao.date.split(" ")[0].split("-");
    const dataCitacao: string = `${ArrayDataCitacaoParaFormatacao[2]}/${ArrayDataCitacaoParaFormatacao[1]}/${ArrayDataCitacaoParaFormatacao[0]}`
    return dataCitacao;
}