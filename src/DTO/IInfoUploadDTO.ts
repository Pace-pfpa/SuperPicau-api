import { Interessado } from "../modules/GetTarefa/DTO/IPastaTarefaResponse"

export interface IInfoUploadDTO {
    usuario_nome: string;
    numeroProcesso: string;
    nup: string;
    tarefa_id: number;
    pasta_id: number;
    usuario_setor: number;
    interessados: Interessado[];
}