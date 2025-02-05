import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { extractField } from "../../../../helps/renda.utils/extractField";
import { IFichaSintetica } from "../../../dtos/interfaces/IFichaSintetica";
import { getXPathText } from "../../../../../../shared/utils/GetTextoPorXPATH";
import { CorrigirCpfComZeros } from "../../../../../CreateInterested/Helps/CorrigirCpfComZeros";

export async function getFichaSinteticaDoProcessoSuper(dossie: JSDOMType): Promise<IFichaSintetica> {
    const xpathMap = {
        numeroUnico: "/html/body/div/div[4]/table/tbody/tr[1]/td",
        dataAjuizamento: "/html/body/div/div[4]/table/tbody/tr[2]/td",
        assunto: "/html/body/div/div[4]/table/tbody/tr[4]/td",
        nome: "/html/body/div/div[4]/table/tbody/tr[6]/td",
        cpf: "/html/body/div/div[4]/table/tbody/tr[7]/td"
    };

    const safeExtractField = async (xpath: string, errorMessage: string) => {
        try {
            return await extractField(dossie, xpath, errorMessage);
        } catch (error) {
            return null;
        }
    };

    const numeroUnicoRaw = await safeExtractField(xpathMap.numeroUnico, "Número único não encontrado");
    const dataAjuizamentoRaw = await safeExtractField(xpathMap.dataAjuizamento, "Data de ajuizamento não encontrada");
    const assuntoRaw = await safeExtractField(xpathMap.assunto, "Assunto não encontrado");

    let nomeCerto: string | null = await safeExtractField(xpathMap.nome, "Nome não encontrado");
    if (nomeCerto) nomeCerto = getXPathText(dossie, xpathMap.nome) || nomeCerto;

    const cpfDosprevRaw = await safeExtractField(xpathMap.cpf, "CPF não encontrado");
    const cpfFormatado = cpfDosprevRaw ? CorrigirCpfComZeros(cpfDosprevRaw) : null;

    return {
        numeroUnico: numeroUnicoRaw.trim().replace(/\D/g, ''),
        dataAjuizamento: dataAjuizamentoRaw,
        assunto: assuntoRaw,
        nome: nomeCerto,
        cpf: cpfFormatado
    };
}
