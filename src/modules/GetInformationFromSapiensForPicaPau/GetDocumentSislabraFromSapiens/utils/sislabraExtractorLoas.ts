import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { ISislabraExtractedLoas } from "../interfaces/ISislabraExtractedLoas";
import { getAeronaves } from "../SislabraBusiness/GetAeronavesSislabra";
import { getBensTSE } from "../SislabraBusiness/GetBensTSE";
import { getDoacaoEleitoral } from "../SislabraBusiness/GetDoacaoEleitoral";
import { getEmbarcacoes } from "../SislabraBusiness/GetEmbarcacoesSislabra";
import { getEmpregoSislabra } from "../SislabraBusiness/GetEmpregoSislabra";
import { getEmpresa } from "../SislabraBusiness/GetEmpresaSislabra";
import { getImoveisRurais } from "../SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveisSP } from "../SislabraBusiness/GetImoveisSp";
import { getInformation } from "../SislabraBusiness/getInformation";
import { getVeiculos } from "../SislabraBusiness/GetVeiculosSislabra";
import { deveDesconsiderarVeiculos } from "./deveDesconsiderarVeiculos";

export async function sislabraExtractorLoas(
    paginaSislabra: JSDOMType, 
    isPoloAtivo: boolean
): Promise<ISislabraExtractedLoas> {
    const getNome = await getInformation(paginaSislabra);

    const getVeiculosSislabra = await getVeiculos(paginaSislabra);
    const isVeiculosIrrelevantes = deveDesconsiderarVeiculos(getVeiculosSislabra);

    const getEmpregos = await getEmpregoSislabra(paginaSislabra);
    const getImoveisRuraisSislabra = await getImoveisRurais(paginaSislabra);
    const getEmpresaSislabra = await getEmpresa(paginaSislabra);
    const getBens = await getBensTSE(paginaSislabra);
    const getImoveisSPRaw = await getImoveisSP(paginaSislabra);
    const getEmbarcacao = await getEmbarcacoes(paginaSislabra);
    const getAeronave = await getAeronaves(paginaSislabra);
    const getDoacao = await getDoacaoEleitoral(paginaSislabra);

    return {
        nome: getNome,
        identificacao: isPoloAtivo ? "AUTOR" : "GRUPO FAMILIAR",
        veiculos: isVeiculosIrrelevantes ? null : getVeiculosSislabra,
        empregos: getEmpregos.length > 0 ? getEmpregos : null,
        empresas: getEmpresaSislabra.length > 0 ? getEmpresaSislabra : null,
        imoveisRurais: getImoveisRuraisSislabra.length > 0 ? getImoveisRuraisSislabra : null,
        bensTse: getBens,
        imoveisSp: getImoveisSPRaw,
        embarcacao: getEmbarcacao,
        aeronave: getAeronave,
        doacaoEleitoral: getDoacao
    }
}