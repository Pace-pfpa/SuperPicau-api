import { UsuarioResponseDTO } from "../../GetUsuario/dtos/UsuarioResponseDTO";
import { EspecieTarefa } from "./IEspecieTarefaResponse";
import { Minuta } from "./IMinutaTarefaResponse";
import { Pasta } from "./IPastaTarefaResponse";
import { SetorResponsavel } from "./ISetorTarefaResponse";

export interface ITarefaResponse {
    id: number;
    uuid: string;
    postIt: string;
    urgente: boolean;
    redistribuida: boolean;
    distribuicaoAutomatica: boolean;
    livreBalanceamento: boolean;
    dataHoraInicioPrazo: { date: string };
    dataHoraFinalPrazo: { date: string };
    tipoDistribuicao: number;
    criadoEm: { date: string };
    atualizadoEm: { date: string };
    usuarioResponsavel: UsuarioResponseDTO;
    pasta: Pasta;
    especieTarefa: EspecieTarefa;
    setorResponsavel: SetorResponsavel;
    minutas: Minuta[];
    criadoPor: UsuarioResponseDTO;
    atualizadoPor: UsuarioResponseDTO;
    acompanhamentos: any[];
    acompanhada: boolean;
    usuarioResponsavel_id: number;
    pasta_id: number;
    especieTarefa_id: number;
    setorResponsavel_id: number;
    criadoPor_id: number;
    atualizadoPor_id: number;
}
