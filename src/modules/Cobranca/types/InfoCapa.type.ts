import { PoloInfo } from "../utils/identificarPolos"

export type InfoCapa = {
    valorCausa: string;
    valorCausaNumerico: number;
    poloAtivo: PoloInfo;
    poloPassivo: PoloInfo[];
    etiqueta: string | null
}