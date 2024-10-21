export interface IInformacoesProcessoDTO {
    tarefaId: number,
    cookie: string,
    tipo_triagem: Number,
    capaFormatada: string,
    cpfCapa: string,
    arrayDeDocumentos: any[],
    dosprevPoloAtivo: any[],
    isDosprevPoloAtivoNormal: boolean,
    sislabraPoloAtivo: any,
    sislabraConjuge: any
}