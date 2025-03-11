import { UpdateEtiquetaUseCase } from "./UpdateEtiquetaUseCase";
import { UpdateEtiquetaController } from "./UpdateEtiquetaController";
import { EtiquetaService } from "./EtiquetaService";

export const updateEtiquetaUseCase = new UpdateEtiquetaUseCase();
export const updateEtiquetaController = new UpdateEtiquetaController(updateEtiquetaUseCase)

export const etiquetaService = new EtiquetaService();
