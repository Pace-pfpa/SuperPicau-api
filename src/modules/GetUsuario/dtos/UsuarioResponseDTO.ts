interface LastLogin {
    date: string;
}

interface Lotacao {
  id: number;
  peso: number;
  principal: boolean;
  distribuidor: boolean;
  coordenador: boolean;
  arquivista: boolean;
  pcu: boolean;
  apoioDisciplinar: boolean;
  criadoEm: { date: string };
  atualizadoEm: { date: string };
  setor: {
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
    criadoEm: any[];
    atualizadoEm: any[];
    especieSetor: any[];
    unidade: Unidade;
    especieSetor_id: number;
    unidade_id: number;
  },
  setor_id: number
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
  apenasDistribuicaoAutomatica: number;
  comPrevencaoRelativa: number;
  criadoEm: { date: string };
  atualizadoEm: { date: string };
  modalidadeOrgaoCentral: {
    id: number;
    valor: string;
    descricao: string;
    ativo: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
  },
  generoSetor: {
    id: number;
    valor: string;
    descricao: string;
    ativo: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
  },
  modalidadeOrgaoCentral_id: number;
  generoSetor_id: number;
}
  
export interface UsuarioResponseDTO {
    username: string;
    usernameCanonical: string;
    email: string;
    emailCanonical: string;
    enabled: boolean;
    salt: string;
    password: string;
    lastLogin: LastLogin;
    roles: string[];
    id: number;
    nome: string;
    nivelAcesso: number;
    assinaturaHTML: string;
    validado: boolean;
    configuracoes: string;
    colaborador: {
      id: number,
      ativo: boolean,
      criadoEm: any[],
      atualizadoEm: any[],
      modalidadeColaborador: any[],
      lotacoes: Lotacao[],
      modalidadeColaborador_id: number
    }
}
  