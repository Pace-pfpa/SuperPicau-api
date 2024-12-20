import { GetPastaUseCase } from "./GetPastaUseCase";
import { RequestGetPasta } from "./operations/request/RequestGetPasta";

export const requestGetPasta = new RequestGetPasta();
export const getPastaUseCase = new GetPastaUseCase(requestGetPasta);