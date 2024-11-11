import { GetArvoreDocumentoController } from "./GetArvoreDocumentoController";
import { GetArvoreDocumentoUseCase } from "./GetArvoreDocumentoUseCase";

export const getArvoreDocumentoUseCase = new GetArvoreDocumentoUseCase();
export const getArvoreDocumentoController = new GetArvoreDocumentoController(getArvoreDocumentoUseCase);

export * from './facades/GetArvoreDocumentoFacade';
export * from './dtos/GetArvoreDocumentoDTO';
export * from './dtos/ResponseArvoreDocumentoDTO';