import { IInfoUploadDTO, IObjInfoImpeditivosLoas } from "../GetInformationFromSapiensForPicaPau/dto";
import { IResponseLabraAutorGF } from "../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/IResponseLabraAutorGF";
import { HtmlIImpeditivosLoasDTO } from "./dto/HtmlImpeditivosLoasDTO";

export class ImpeditivosHtmlLoas {
    async execute(
            data: HtmlIImpeditivosLoasDTO,
            infoUpload: IInfoUploadDTO,
            impedimentosDosprev: IObjInfoImpeditivosLoas, 
            impedimentosLabra: IResponseLabraAutorGF
    ): Promise<string> {
        return 'RAUL';
    }
}