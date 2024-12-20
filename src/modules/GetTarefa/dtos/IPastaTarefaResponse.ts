export interface Pasta {
    id: number;
    uuid: string;
    documentoAvulso: boolean;
    unidadeArquivistica: number;
    tipoProtocolo: number;
    novo: boolean;
    protocoloEletronico: boolean;
    semValorEconomico: boolean;
    emTramitacao: number;
    NUP: string;
    visibilidadeRestrita: boolean;
    visibilidadeExterna: boolean;
    visibilidadeDisciplinar: boolean;
    encerrado: boolean;
    dataHoraAbertura: { date: string };
    titulo: string;
    chaveAcesso: string;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    setor: Setor;
    processoJudicial: ProcessoJudicial;
    relevancias: any[]; // Achar tipo
    lembretes: any[]; // Achar tipo
    assuntos: Assunto[];
    interessados: Interessado[];
    setor_id: number;
    processoJudicial_id: number;
}
  
interface Setor {
    id: number;
    nome: string;
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
}
  
interface ProcessoJudicial {
    id: number;
    numero: string;
    fonteDados: string;
    dataHoraAjuizamento: { date: string };
    competencia: number;
    codigoLocalidade: string;
    intervencaoMP: boolean;
    AJG: boolean;
    eletronico: boolean;
    tamanhoProcesso: number;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
}
  
interface Assunto {
    id: number;
    principal: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    assuntoAdministrativo: AssuntoAdministrativo;
    assuntoAdministrativo_id: number;
}
  
interface AssuntoAdministrativo {
    id: number;
    nome: string;
    ativo: boolean;
    dispositivoLegal: string;
    glossario: string;
    codigoCNJ: string;
    lft: number;
    lvl: number;
    rgt: number;
    root: number;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
}
  
export interface Interessado {
    id: number;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    pessoa: Pessoa;
    pessoa_id: number;
}
  
interface Pessoa {
    id: number;
    uuid: string;
    pessoaRepresentada: boolean;
    pessoaInteressada: boolean;
    pessoaConveniada: boolean;
    pessoaValidada: boolean;
    nome: string;
    numeroDocumentoPrincipal: string;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
}
  