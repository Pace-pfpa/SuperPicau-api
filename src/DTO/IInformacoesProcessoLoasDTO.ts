export interface IInformacoesProcessoLoasDTO {
    usuario_id: string,
    cookie: string, 
    tipo_triagem: Number,
    capaFormatada: string,
    cpfCapa: string,
    arrayDeDocumentos: any[],
    dosprevPoloAtivo: any[],
    isDosprevPoloAtivoNormal: boolean,
    dossieSocialInfo: {
        gastosComMedicamentos: boolean,
        grupoFamiliarCpfs: string[]
    },
    arrayDeDossiesNormais: any[],
    arrayDeDossiesSuper: any[]
}