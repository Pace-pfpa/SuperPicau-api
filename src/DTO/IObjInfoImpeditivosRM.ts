import { EmpregoDP } from "./IImpeditivosRM";

export interface IObjInfoImpeditivosRM {
    requerimento: string | null;
    emprego: EmpregoDP[];
    concessaoAnterior: string | null;
    litispendencia: string | null;
}

export interface IObjInfoImpeditivosLoas {
    cadunico: string | null;
    litispendencia: string | null;
    bpc: string | null;
    idade: string | null;
    requerimento: string | null;
    renda: string | null;
}

export interface IReturnImpedimentosRM {
    arrayDeImpedimentos: string;
    objImpedimentosRM: IObjInfoImpeditivosRM;
}



export interface IReturnImpedimentosLOAS {
    arrayDeImpedimentos: string;
    objImpedimentosLoas: IObjInfoImpeditivosLoas;
}