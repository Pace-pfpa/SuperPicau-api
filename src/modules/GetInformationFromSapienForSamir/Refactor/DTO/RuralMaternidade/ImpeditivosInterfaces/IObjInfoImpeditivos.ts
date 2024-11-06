import { EmpregoDP } from "../ImpeditivosTypes/TEmpregoDP";

export interface IObjInfoImpeditivosRM {
    requerimento: string | null;
    emprego: EmpregoDP[];
    concessaoAnterior: string | null;
    litispendencia: string | null;
}