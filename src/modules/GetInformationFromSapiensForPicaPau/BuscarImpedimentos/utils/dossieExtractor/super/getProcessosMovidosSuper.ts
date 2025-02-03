import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { countChildElements } from "../../../../helps/renda.utils/countChildElements";
import { IProcessosMovidos } from "../../../dtos/interfaces/IProcessosMovidos";
import { hasProcessos } from "../dossieExtractor.utils/hasProcessos";
import { safeExtractField } from "../dossieExtractor.utils/safeExtractField";

export async function getProcessosMovidosSuper(dossie: JSDOMType): Promise<IProcessosMovidos[]> {
    const arrayProcessosMovidos: IProcessosMovidos[] = [];
    const possuiProcessos = await hasProcessos(dossie, 5);

    if (!possuiProcessos) return arrayProcessosMovidos;

    try {
        const baseXPath = "/html/body/div/div[5]/table/tbody/tr";
        const rowCount = countChildElements(dossie, `${baseXPath}`);

        for (let row = 1; row <= rowCount; row++) {
            const processoJudicialRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[1]`, "Processo judicial não encontrado");
            const assuntoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[2]`, "Assunto não encontrado");
            const ajuizamentoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[5]`, "Assunto não encontrado");
            const dataAberturaRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[6]`, "Assunto não encontrado");

            const objetoProcesso: IProcessosMovidos = {
                numeroProcesso: processoJudicialRaw,
                assunto: assuntoRaw,
                ajuizamento: ajuizamentoRaw,
                dataAbertura: dataAberturaRaw
            }

            arrayProcessosMovidos.push(objetoProcesso);
        }

        return arrayProcessosMovidos;
    } catch (error) {
        console.error("Error in getProcessosMovidosSuper:", error.message);
        return null;
    }
}