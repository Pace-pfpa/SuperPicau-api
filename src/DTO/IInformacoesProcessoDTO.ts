export interface IInformacoesProcessoDTO {
    usuario_id: string,
    tipo_triagem: Number,
    cpfCapa: string,
    arrayDeDocumentos: any[],
    dosprevPoloAtivo: any[],
    isDosprevPoloAtivoNormal: boolean,
}