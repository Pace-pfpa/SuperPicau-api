import { EmpregoDP } from "../types/EmpregoDPType";

export interface IObjInfoImpeditivosRM {
    requerimento: string | null;
    emprego: EmpregoDP[];
    concessaoAnterior: string | null;
    litispendencia: string | null;
}