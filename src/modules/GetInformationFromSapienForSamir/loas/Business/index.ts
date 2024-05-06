import { RestabelecimentoRequerimentos } from "./RestabelecimentoRequerimentosDossie";
import { RestabelecimentoRequerimentosSuperDossie } from "./RestabelecimentoRequerimentosSuperDossie";
import { LoasLitispendencia } from "./LoasLitispendenciadDossie";
import { LoasLitispendenciaSuperDossie } from "./LoasLitispendenciaSuperDossie";
import { LoasEmpregoDossie } from "./LoasEmpregoDossie";
import { LoasEmpregoSuperDossie } from "./LoasEmpregoSuperDossie";


export const loasEmpregoSuperDossie = new LoasEmpregoSuperDossie();
export const loasEmpregoDossie = new LoasEmpregoDossie();
export const loasLitispendenciaSuperDossie = new LoasLitispendenciaSuperDossie();
export const loasLitispendencia = new LoasLitispendencia();
export const restabelecimentoRequerimentosDossie = new RestabelecimentoRequerimentos();
export const restabelecimentoRequerimentosSuperDossie = new RestabelecimentoRequerimentosSuperDossie()