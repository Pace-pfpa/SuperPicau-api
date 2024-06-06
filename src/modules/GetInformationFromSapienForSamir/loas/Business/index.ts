import { RestabelecimentoRequerimentos } from "./Dossie/RestabelecimentoRequerimentosDossie";
import { RestabelecimentoRequerimentosSuperDossie } from "./SuperDossie/RestabelecimentoRequerimentosSuperDossie";
import { LoasLitispendencia } from "./Dossie/LoasLitispendenciadDossie";
import { LoasLitispendenciaSuperDossie } from "./SuperDossie/LoasLitispendenciaSuperDossie";
import { LoasEmpregoDossie } from "./Dossie/LoasEmpregoDossie";
import { LoasEmpregoSuperDossie } from "./SuperDossie/LoasEmpregoSuperDossie";
import { LoasAtivoSuperDossie } from "./SuperDossie/LoasAtivoSuperDossie";
import { LoasAtivoDossie } from "./Dossie/LoasAtivoDossie";
import { LoasIdadeSuperDossie } from "./SuperDossie/LoasIdadeSuperDossie";
import { LoasIdadeDossie } from "./Dossie/LoasIdadeDossie";


export const loasEmpregoSuperDossie = new LoasEmpregoSuperDossie();
export const loasEmpregoDossie = new LoasEmpregoDossie();
export const loasLitispendenciaSuperDossie = new LoasLitispendenciaSuperDossie();
export const loasLitispendencia = new LoasLitispendencia();
export const restabelecimentoRequerimentosDossie = new RestabelecimentoRequerimentos();
export const restabelecimentoRequerimentosSuperDossie = new RestabelecimentoRequerimentosSuperDossie();
export const loasAtivoSuperDossie = new LoasAtivoSuperDossie();
export const loasAtivoDossie = new LoasAtivoDossie();
export const loasIdadeSuperDossie = new LoasIdadeSuperDossie();
export const loasIdadeDossie = new LoasIdadeDossie();