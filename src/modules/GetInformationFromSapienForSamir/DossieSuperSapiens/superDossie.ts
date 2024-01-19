import { IInformationsForCalculeDTO } from "../../../DTO/InformationsForCalcule";
import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { VerificaçaoDaQuantidadeDeDiasParaInspirarOSuperDossie } from "../../../helps/VerificaçaoDaQuantidadeDeDiasParaInspirarOSuperDossie";
import { MinhaErroPersonalizado } from "../helps/ErrorMensage";
import { coletarCitacao } from "../helps/coletarCitacao";
import { fazerInformationsForCalculeDTO } from "../helps/contruirInformationsForCalcule";
import { getInformaçoesIniciasDosBeneficiosSuperDosprev } from "../helps/getInformaçoesIniciasDosBeneficiosSuperDosprev";
import { getInformaçoesSecudariaDosBeneficiosSuperDossie } from "../helps/getInformaçoesSecudariaDosBeneficiosSuperDossie";
import { isValidInformationsForCalculeDTO } from "../helps/validadorDeInformationsForCalculeDTO";

export class SuperDossie {
    async handle(paginaDosprev: any) {
        

    }

}