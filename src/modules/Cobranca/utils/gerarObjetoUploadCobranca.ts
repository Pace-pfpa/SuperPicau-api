import { HtmlImpeditivosCobrancaType } from "../types/HtmlImpeditivosCobranca.type";

export function gerarObjetoUploadCobranca(impeditivos: string[]): HtmlImpeditivosCobrancaType {
    console.log(impeditivos)
    const objeto: HtmlImpeditivosCobrancaType = {
        empresa: impeditivos.some(imp => imp.trim().includes("EMPRESA")),
        bensTSE: impeditivos.some(imp => imp.trim().includes("BENS TSE")),
        veiculos: impeditivos.some(imp => imp.trim().includes("VEÍCULOS")),
        imoveisSP: impeditivos.some(imp => imp.trim().includes("IMÓVEL SP")),
        imovelRural: impeditivos.some(imp => imp.trim().includes("IMÓVEL RURAL")),
        embarcacao: impeditivos.some(imp => imp.trim().includes("EMBARCAÇÃO")),
        aeronave: impeditivos.some(imp => imp.trim().includes("AERONAVE")),
    };

    return objeto;
}
