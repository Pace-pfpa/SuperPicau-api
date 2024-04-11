import { GetCapaDoPassivaUseCase } from "./GetCapaDoPassivaUseCase";
import { GetCapaDoPassivaController } from "./GetCapaDoPassivaController";

export const  getCapaDoPassivaUseCase = new GetCapaDoPassivaUseCase();
export const  getCapaDoPassivaController = new GetCapaDoPassivaController(getCapaDoPassivaUseCase);


