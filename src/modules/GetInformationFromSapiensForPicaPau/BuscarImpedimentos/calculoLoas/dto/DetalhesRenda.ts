export interface DetalhesRenda {
    numMembrosFamilia: number;
    mediaAjuizamento: number;
    mediaRequerimento: number;
    salarioMinimoAjuizamento: number;
    salarioMinimoRequerimento: number;
    isFallback: boolean;
    fallbackInfo: {
        nome: string;
        cpf: string;
        fallbackRemuneracao: number;
        fallbackDate: string;
    }[] | null;
}