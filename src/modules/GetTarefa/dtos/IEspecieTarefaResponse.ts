export interface EspecieTarefa {
    id: number;
    nome: string;
    ativo: boolean;
    evento: boolean;
    descricao: string;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    generoTarefa: GeneroTarefa;
    generoTarefa_id: number;
}
  
interface GeneroTarefa {
    id: number;
    nome: string;
    descricao: string;
    ativo: boolean;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
}
  