import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getInformationCapa } from "../../GetInformationCapa";
import { IInfoMinutaDTO } from "../dtos/IInfoMinutaDTO";
import { tentarBuscaMultipla } from "./tentarBuscaMultipla";

export async function buscarInfoForMinuta(capa: JSDOMType): Promise<IInfoMinutaDTO> {
    const xpathOrgaoJulgadorPrincipal = "/html/body/div/div[4]/table/tbody/tr[3]/td[2]";

    const orgaoJulgadorProcessoPrincipal = tentarBuscaMultipla(capa, xpathOrgaoJulgadorPrincipal, 5);
    const infoCapa = await getInformationCapa.buscarInformacoesForUpload(capa);

    const infoMinuta: IInfoMinutaDTO = {
        infoRequerente: infoCapa,
        vara: orgaoJulgadorProcessoPrincipal
    }

    return infoMinuta;
}