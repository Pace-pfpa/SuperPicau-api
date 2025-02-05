import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { IRequerimentos } from "../../../dtos/interfaces/IRequerimentos";
import { hasRequerimentos } from "../dossieExtractor.utils/hasRequerimentos";
import { countChildElements } from "../../../../helps/renda.utils/countChildElements";
import { safeExtractField } from "../dossieExtractor.utils/safeExtractField";

export async function getRequerimentosNormal(dossie: JSDOMType): Promise<IRequerimentos[]> {
    const arrayRequerimentos: IRequerimentos[] = [];
    const possuiRequerimentos = await hasRequerimentos(dossie, 3);
    
    if (!possuiRequerimentos) return arrayRequerimentos;

    try {
        const baseXPath = "/html/body/div/div[3]/table/tbody/tr";
        const rowCount = countChildElements(dossie, `${baseXPath}`);

        for (let row = 2; row <= rowCount; row++) {
            const nbRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[1]`, "NB não encontrado");
            const beneficioRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[2]`, "Benefício não encontrado");
            const derRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[3]`, "DER não encontrada");
            const dataInicioRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[4]`, "Data de início não encontrada");
            const dataCessacaoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[5]`, "Data de cessação não encontrada");
            const statusRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[6]`, "Status não encontrado");

            const objetoRequerimento: IRequerimentos = {
                numeroBeneficio: nbRaw.trim().replace(/\D/g, ''),
                beneficio: beneficioRaw,
                der: derRaw,
                dataInicio: dataInicioRaw,
                dataCessacao: dataCessacaoRaw,
                status: statusRaw
            }

            arrayRequerimentos.push(objetoRequerimento);
        }

        return arrayRequerimentos;
    } catch (error) {
        console.error("Error in getRequerimentosNormal:", error.message);
        return [];
    }
}
