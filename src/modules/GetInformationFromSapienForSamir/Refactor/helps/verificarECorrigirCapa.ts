const { JSDOM } = require('jsdom');
import { IGetInformationsFromSapiensDTO } from "../../../../DTO/GetInformationsFromSapiensDTO";
import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
import { getCapaDoPassivaUseCase } from "../../../GetCapaDoPassiva";
import { verificarCapaTrue } from "../../helps/verificarCapaTrue";

export async function verificarECorrigirCapa(data: IGetInformationsFromSapiensDTO, cookie: string): Promise<any> {
    const capaParaVerificar = await getCapaDoPassivaUseCase.execute(data.tarefa.pasta.NUP, cookie);
    const capaFormatada = new JSDOM(capaParaVerificar);

    const infoClasseExist = await verificarCapaTrue(capaFormatada);
    if (!infoClasseExist) {
        const novaCapa = await buscarNovaCapaComOutroXPath(capaFormatada, cookie, data);
        return novaCapa;
    }
    return capaFormatada;
}

export async function buscarNovaCapaComOutroXPath(capaFormatada: any, cookie: string, data: IGetInformationsFromSapiensDTO): Promise<any> {
    const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b";
    const novaNup = await getXPathText(capaFormatada, xpathNovaNup);
    const nupFormatada: string = novaNup.split('(')[0].replace(/[./-]/g, "").trim();
    
    const capa = await getCapaDoPassivaUseCase.execute(nupFormatada, cookie);
    return new JSDOM(capa);
}
