import { HtmlIImpeditivosRuralMaternidadeDTO } from "../CreateHtmlForRuralMaternidade/dtos/HtmlImpeditivosRMDTO";
import { IInfoUploadDTO, IObjInfoImpeditivosRM, IResponseLabraAutorConjuge } from "../GetInformationFromSapiensForPicaPau/dto";

export class ImpeditivosHtmlRural {
    async execute(
        data: HtmlIImpeditivosRuralMaternidadeDTO,
        infoUpload: IInfoUploadDTO,
        impedimentosDosprev: IObjInfoImpeditivosRM, 
        impedimentosLabra: IResponseLabraAutorConjuge
    ): Promise<string> {

        const html = `
            CAVANI
        `;

        return html;
    }
}