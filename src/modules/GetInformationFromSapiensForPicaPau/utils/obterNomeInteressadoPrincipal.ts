import { IInfoUploadDTO } from "../dto";

export function obterNomeInteressadoPrincipal(informacoesProcesso: IInfoUploadDTO): string {
    const interessados = informacoesProcesso.interessados;
    for (let interessado of interessados) {
        const nome = interessado.pessoa.nome;
        if (nome !== "MINIST�RIO P�BLICO fEDERAL (PROCURADORIA)" &&
            nome !== "MINISTERIO PUBLICO FEDERAL (PROCURADORIA)" &&
            nome !== "CENTRAL DE ANÁLISE DE BENEFÍCIO - CEAB/INSS" &&
            nome !== "INSTITUTO NACIONAL DO SEGURO SOCIAL-INSS" &&
            nome !== "INSTITUTO NACIONAL DO SEGURO SOCIAL - INSS") {
            return nome.split(" ")[0];
        }
    }
    return "DESCONHECIDO";
}
