export interface IInformacoesProcessoLoasDTO {
    usuario_id: string,
    tipo_triagem: Number,
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