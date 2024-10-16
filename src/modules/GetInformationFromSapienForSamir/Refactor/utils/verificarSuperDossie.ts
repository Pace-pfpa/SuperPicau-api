import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
import { updateEtiquetaUseCase } from "../../../UpdateEtiqueta";

export async function verificarSuperDossie(parginaDosPrevFormatada, cookie, tarefaId) {
    const verifarSeFoiGerado = (getXPathText(parginaDosPrevFormatada, "/html/body/div")).trim() == "Não foi possível a geração do dossiê previdenciário.";

    if (verifarSeFoiGerado) {
        await updateEtiquetaUseCase.execute({ cookie, etiqueta: "AVISO: FALHA AO GERAR SUPER DOSPREV", tarefaId });
        return { warning: "Falha ao gerar Super DOSPREV" };
    }

    const NewDossiewithErro = (getXPathText(parginaDosPrevFormatada, '/html/body/div')).trim() == 'Falha ao gerar dossiê. Será necessário solicitá-lo novamente.';
    
    if (NewDossiewithErro) {
        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `AVISO: FALHA AO GERAR DOSSIE SUPER SAPIENS`, tarefaId });
        return { warning: `Falha ao gerar dossiê super sapiens` };
    }

    return null;
}