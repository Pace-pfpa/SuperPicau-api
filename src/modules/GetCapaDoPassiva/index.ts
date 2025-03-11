import { etiquetaService } from "../UpdateEtiqueta";
import { GetCapaDoPassivaUseCase } from "./GetCapaDoPassivaUseCase";
import { GetCapaDoPassivaController } from "./GetCapaDoPassivaController";
import { CapaService } from "./CapaService";

export const  getCapaDoPassivaUseCase = new GetCapaDoPassivaUseCase();
export const  getCapaDoPassivaController = new GetCapaDoPassivaController(getCapaDoPassivaUseCase);

export const capaService = new CapaService(etiquetaService);
