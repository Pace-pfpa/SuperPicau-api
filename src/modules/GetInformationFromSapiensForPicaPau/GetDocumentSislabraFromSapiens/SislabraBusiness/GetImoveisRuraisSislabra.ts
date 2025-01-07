import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { ImovelRural } from "../../dto";

export async function getImoveisRurais(paginaSislabra: JSDOMType): Promise<ImovelRural[]> {

    const imoveisRuraisEncontrados: ImovelRural[] = [];
        let valueWhile = true;
        let contadorXPath = 2;

    while (valueWhile) {
            const nomeImovelRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[4]`);
            const sncrRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[3]`);
            const numeroCafirRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[17]`);
            const dataInscricaoRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[18]`);
            const localizacaoRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[19]`);
            const distritoRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[20]`);
            const cepRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[21]`);
            const municipioRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[22]`);
            const ufRural = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[${contadorXPath}]/td[23]`);

        if (!nomeImovelRural) {
                break;
        }

        imoveisRuraisEncontrados.push({
                nomeImovel: nomeImovelRural,
                sncr: sncrRural.trim() || "SNCR NÃO ENCONTRADO",
                numeroCafir: numeroCafirRural.trim() || "NÚMERO CAFIR NÃO ENCONTRADO",
                dataInscricao: dataInscricaoRural.trim() || "DATA DE INSCRIÇÃO NÃO ENCONTRADA",
                localizacao: localizacaoRural.trim() || "LOCALIZAÇÃO NÃO ENCONTRADA",
                distrito: distritoRural.trim() === '' ? "DISTRITO NÃO ENCONTRADO" : distritoRural,
                cep: cepRural.trim() || "CEP NÃO ENCONTRADO",
                municipio: municipioRural.trim() || "MUNICÍPIO NÃO ENCONTRADO",
                uf: ufRural.trim() || "UF NÃO ENCONTRADO",
        });

        contadorXPath += 1;

    }

    return imoveisRuraisEncontrados;
}

