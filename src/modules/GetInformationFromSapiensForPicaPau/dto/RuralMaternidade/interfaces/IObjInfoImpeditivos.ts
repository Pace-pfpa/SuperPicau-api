import { EmpregoDP } from "../types/EmpregoDPType";

export interface IObjInfoImpeditivosMaternidade {
    requerimento: string | null;
    emprego: EmpregoDP[];
    concessaoAnterior: string | null;
    litispendencia: string[] | null;
}