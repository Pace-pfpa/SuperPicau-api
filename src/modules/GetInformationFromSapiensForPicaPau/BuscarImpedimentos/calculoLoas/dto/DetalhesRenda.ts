import { IPicaPauCalculeDTO } from "../../../dto";

export interface DetalhesRenda {
    rendaFamiliar?: string;
    numMembrosFamilia: number;
    mediaAjuizamento: number;
    mediaRequerimento: number;
    salarioMinimoAjuizamento: number;
    salarioMinimoRequerimento: number;
    informacoesRequerente: IPicaPauCalculeDTO,
    informacoesFamilia: IPicaPauCalculeDTO[],
    isFallback: boolean;
    fallbackInfo: {
        nome: string;
        cpf: string;
        fallbackRemuneracao: number;
        fallbackDate: string;
    }[] | null;
}