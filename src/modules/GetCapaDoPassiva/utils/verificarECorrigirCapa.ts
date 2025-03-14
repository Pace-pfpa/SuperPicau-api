import { getCapaDoPassivaUseCase } from "..";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { verificarCapaTrue } from "../utils";
import { JSDOM } from 'jsdom';


export async function verificarECorrigirCapa(nup: string, cookie: string): Promise<JSDOM> {

    try {
        const capaParaVerificar = await getCapaDoPassivaUseCase.execute(nup, cookie);
        const capaFormatada = new JSDOM(capaParaVerificar);

        const infoClasseExist = await verificarCapaTrue(capaFormatada);
        if (!infoClasseExist) {
            try {
                const novaCapa = await buscarNovaCapaComOutroXPath(capaFormatada, cookie);
                return novaCapa;
            } catch (error) {
                console.error("Erro ao buscar nova capa:", error);
                throw new Error("Falha na verificação da capa. Verifique o processo.");
            }
        }
        return capaFormatada;
    } catch (error) {
        console.error("Erro ao verificar e corrigir a capa:", error);
        throw new Error("Falha na verificação da capa. Verifique o processo.");
    }
}

export async function buscarNovaCapaComOutroXPath(capaFormatada: any, cookie: string): Promise<JSDOM> {

    const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b";
    const novaNup = getXPathText(capaFormatada, xpathNovaNup);

    if (!novaNup) {
        throw new Error("Novo NUP não encontrado no XPath especificado.");
    }

    const nupFormatada = novaNup.split('(')[0].replace(/[./-]/g, "").trim();

    try {
        const capa = await getCapaDoPassivaUseCase.execute(nupFormatada, cookie);
        return new JSDOM(capa);
    } catch (error) {
        console.error("Erro ao buscar capa com novo NUP:", error);
        throw new Error("Erro ao buscar nova capa com NUP formatado.");
    }
}
