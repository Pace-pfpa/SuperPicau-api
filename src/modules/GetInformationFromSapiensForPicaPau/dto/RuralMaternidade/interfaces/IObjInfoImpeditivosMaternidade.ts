import { EmpregoDP } from "../types/EmpregoDPType";

export interface IObjInfoImpeditivosMaternidade {
    requerimento: string | null;
    beneficioAtivo: string[] | null;
    concessaoAnterior: string[] | null;
    beneficioIncompativel: string[] | null;
    emprego: EmpregoDP[];
    litispendencia: string[] | null;
}
