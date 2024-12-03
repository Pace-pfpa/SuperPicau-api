import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { ResponseGetPasta } from "./operations/response/ResponseGetPasta";
import { RequestGetPasta } from "./operations/request/RequestGetPasta";

export class GetPastaUseCase {
    constructor(private readonly RequestGetPasta: RequestGetPasta){};
    async execute(nup: string,cookie: string): Promise<ResponseGetPasta> {

        const getPasta = await this.RequestGetPasta.execute(nup);
        
        const response: ResponseGetPasta = await RequestSapiens(cookie, getPasta);
        
        return response;
    }
}
