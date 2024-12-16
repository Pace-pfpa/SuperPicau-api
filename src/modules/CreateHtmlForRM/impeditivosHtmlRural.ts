import { HtmlIImpeditivosRuralMaternidadeDTO } from "../CreateHtmlForRuralMaternidade/dtos/HtmlImpeditivosRMDTO";
import { IInfoUploadDTO, IResponseLabraAutorConjuge } from "../GetInformationFromSapiensForPicaPau/dto";
import { IObjInfoImpeditivosRural } from "../GetInformationFromSapiensForPicaPau/dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";

export class ImpeditivosHtmlRural {
    async execute(
        data: HtmlIImpeditivosRuralMaternidadeDTO,
        infoUpload: IInfoUploadDTO,
        impedimentosDosprev: IObjInfoImpeditivosRural, 
        impedimentosLabra: IResponseLabraAutorConjuge
    ): Promise<string> {

        const html = `
            EM CONSTRUÇÃO
        `;

        return html;
    }
}