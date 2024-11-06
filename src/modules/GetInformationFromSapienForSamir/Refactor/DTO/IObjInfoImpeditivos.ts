
export interface IObjInfoImpeditivosLoas {
    cadunico: string | null;
    litispendencia: string | null;
    bpc: string | null;
    idade: string | null;
    requerimento: string | null;
    renda: string | null;
}

export interface IReturnImpedimentosLOAS {
    arrayDeImpedimentos: string;
    objImpedimentosLoas: IObjInfoImpeditivosLoas;
}