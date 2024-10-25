export interface IObjInfoImpeditivosRM {
    requerimento: string | null;
    emprego: string | null;
    concessaoAnterior: string | null;
    litispendencia: string | null;
}

export interface IReturnImpedimentosRM {
    arrayDeImpedimentos: string;
    objImpedimentosRM: IObjInfoImpeditivosRM;
} 