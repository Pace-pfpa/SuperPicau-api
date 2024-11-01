export interface IResponseSislabra {
    impedimentos: string[];
    autor: IImpedimentos;
    conjuge: IImpedimentos;
}

export interface IResponseLabraAutorConjuge {
    autor: IImpedimentos;
    conjuge: IImpedimentos;
}

export type Veiculo = {
    marca: string;
    tipo: string;
    valorEstipulado: string;
    placa: string;
    renavam: string;
    anoFabricacao: string;
    municipio: string;
    restricao: string;
};

export type Emprego = {
    salarioContrato: string;
    ocupacao: string;
    empresa: string;
}

export type Empresa = {
    nomeVinculado: string;
    cpfOuCnpj: string;
    tipoDeVinculo: string;
    dataEntrada: string;
}

export type ImovelRural = {
    nomeImovel: string;
    sncr: string;
    numeroCafir: string;
    dataInscricao: string;
    localizacao: string;
    distrito: string;
    cep: string;
    municipio: string;
    uf: string;
}

export interface IImpedimentos {
    veiculos: Veiculo[];
    empregos: Emprego[];
    imoveisRurais: ImovelRural[];
    empresas: Empresa[];
}
  