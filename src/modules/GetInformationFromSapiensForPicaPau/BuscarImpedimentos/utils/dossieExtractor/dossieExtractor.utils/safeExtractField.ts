import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { extractField } from "../../../../helps/renda.utils/extractField";

export const safeExtractField = async (dossie: JSDOMType, xpath: string, errorMessage: string) => {
        try {
            return await extractField(dossie, xpath, errorMessage);
        } catch (error) {
            console.error(`Erro ao extrair campo: ${errorMessage}`);
            return null;
        }
};