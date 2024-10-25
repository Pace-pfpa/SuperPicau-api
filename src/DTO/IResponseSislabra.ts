export interface IResponseSislabra {
    response: string;
    autor: IImpedimentos;
    conjuge: IImpedimentos;
}

export type Veiculo = {
    Marca: string;
    Tipo: string;
    ValorEstipulado: string;
};

export type Emprego = {
    salarioContrato: string;
    ocupacao: string;
}

export interface IImpedimentos {
    veiculos: Veiculo[];
    empregos: Emprego[];
    imoveisRurais: any[];
    empresas: any[];
}
  