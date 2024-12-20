import { RequestUpdateDocumento } from "../../sapiensOperations/resquest/RequestUpdateDocumento";
import { UpdateDocumentoUseCase } from "./UpdateDocumentoUseCase";

const requestUpdateDocumento = new RequestUpdateDocumento();
export const updateDocumentoUseCase = new UpdateDocumentoUseCase(requestUpdateDocumento);