import { IUsuarioUpload } from "../../../../Autenticacao/dtos/IUsuarioUpload";
import { Interessado } from "../../../../GetTarefa/dtos";
import { IInfoMinutaDTO } from "../../../BuscarImpedimentos/dtos/IInfoMinutaDTO";

export interface IInfoUploadDTO {
    usuario: IUsuarioUpload;
    etiqueta: string;
    numeroProcesso: string;
    nup: string;
    tarefa_id: number;
    pasta_id: number;
    usuario_setor: number;
    interessados: Interessado[];
    infoMinuta: IInfoMinutaDTO;
}