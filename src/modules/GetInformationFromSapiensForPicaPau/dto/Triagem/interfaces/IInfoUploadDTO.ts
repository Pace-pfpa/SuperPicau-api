import { Interessado } from "../../../../GetTarefa/dtos";

export interface IInfoUploadDTO {
    usuario_id: string;
    usuario_nome: string;
    etiqueta: string;
    numeroProcesso: string;
    nup: string;
    tarefa_id: number;
    pasta_id: number;
    usuario_setor: number;
    interessados: Interessado[];
}