import { Interessado } from "../../../../GetTarefa/dtos";
import { IInfoMinutaDTO } from "../../../BuscarImpedimentos/dtos/IInfoMinutaDTO";

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
    usuario_unidade: string;
    usuario_setor_nome: string;
    usuario_setor_endereco: string;
    usuario_cargo: string;
    infoMinuta: IInfoMinutaDTO;
}