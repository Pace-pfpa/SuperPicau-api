export interface Minuta {
    id: number;
    uuid: string;
    numeroFolhas: number;
    dataHoraProducao: { date: string };
    visibilidadeRestrita: boolean;
    semEfeito: boolean;
    autor: string;
    redator: string;
    minuta: boolean;
    copia: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    tipoDocumento: TipoDocumento;
    componentesDigitais: ComponentesDigitais[];
    vinculacoesDocumentos: any[]; // Achar tipo
    tipoDocumento_id: number;
}

interface TipoDocumento {
    id: number;
    sigla: string;
    nome: string;
    descricao: string;
    ativo: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    especieDocumento: EspecieDocumento;
    especieDocumento_id: number;
}

interface EspecieDocumento {
    id: number;
    sigla: string;
    nome: string;
    descricao: string;
    ativo: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
}

interface ComponentesDigitais {
    id: number;
    uuid: string;
    filename: string;
    hash: string;
    numeracaoSequencial: number;
    indexado: boolean;
    versoesEliminadas: boolean;
    tamanho: number;
    nivelComposicao: number;
    mimetype: string;
    extensao: string;
    editavel: boolean,
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    assinaturas: any[] // Achar tipo
}
  