export interface SetorResponsavel {
    id: number;
    nome: string;
    endereco: string;
    sigla: string;
    prefixoNUP: string;
    sequenciaInicialNUP: number;
    ativo: boolean;
    gerenciamento: boolean;
    apenasProtocolo: boolean;
    numeracaoDocumentoUnidade: boolean;
    apenasDistribuidor: boolean;
    lft: number;
    lvl: number;
    rgt: number;
    root: number;
    distribuicaoCentena: boolean;
    prazoEqualizacao: number;
    divergenciaMaxima: number;
    apenasDistribuicaoAutomatica: boolean;
    comPrevencaoRelativa: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    unidade: Unidade;
    unidade_id: number;
}
  
interface Unidade {
    id: number;
    nome: string;
    endereco: string;
    email: string;
    sigla: string;
    prefixoNUP: string;
    sequenciaInicialNUP: number;
    ativo: boolean;
    apenasProtocolo: boolean;
    numeracaoDocumentoUnidade: boolean;
    apenasDistribuidor: boolean;
    lft: number;
    lvl: number;
    rgt: number;
    root: number;
    distribuicaoCentena: boolean;
    prazoEqualizacao: number;
    divergenciaMaxima: number;
    apenasDistribuicaoAutomatica: boolean;
    comPrevencaoRelativa: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
}
  