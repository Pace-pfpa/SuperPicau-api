export interface IImpeditivoEmpregoRM {
    haveEmprego: boolean;
    emprego: EmpregoDP[];
}

export type EmpregoDP = {
    vinculo: string;
    dataInicio: string;
    dataFim: string;
    filiacao: string;
    ocupacao: string;
}

export interface IImpeditivoRequerimentoAtivo {
    haveRequerimentoAtivo: boolean;
    requerimentoAtivo: string;
}

export interface IImpeditivoLitispendencia {
    haveLitispendencia: boolean;
    litispendencia: string;
}
