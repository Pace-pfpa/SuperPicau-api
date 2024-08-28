import { UpdateEtiquetaUseCase } from "./UpdateEtiquetaUseCase";
import { UpdateEtiquetaController } from "./UpdateEtiquetaController";

export const updateEtiquetaUseCase = new UpdateEtiquetaUseCase();
export const updateEtiquetaController = new UpdateEtiquetaController(updateEtiquetaUseCase)