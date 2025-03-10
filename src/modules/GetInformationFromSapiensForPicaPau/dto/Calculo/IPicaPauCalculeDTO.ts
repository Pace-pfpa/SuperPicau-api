export interface IPicaPauCalculeDTO {
    nome: string,
    dataAjuizamento: string,
    cpf: string,
    dataNascimento: string,
    dataRequerimento: string | null,
    remuneracaoAjuizamento: number,
    remuneracaoRequerimento: number,
    isFallback: boolean,
    fallbackInfo: {
        fallbackRemuneracao: number,
        fallbackDate: string
    } | null
};
