import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { ISislabraExtracted } from "../interfaces/ISislabraExtracted";
import { getAeronaves } from "../SislabraBusiness/GetAeronavesSislabra";
import { getBensTSE } from "../SislabraBusiness/GetBensTSE";
import { getEmbarcacoes } from "../SislabraBusiness/GetEmbarcacoesSislabra";
import { getEmpresa } from "../SislabraBusiness/GetEmpresaSislabra";
import { getImoveisRurais } from "../SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveisSP } from "../SislabraBusiness/GetImoveisSp";
import { getInformation } from "../SislabraBusiness/getInformation";
import { getVeiculos } from "../SislabraBusiness/GetVeiculosSislabra";
import { deveDesconsiderarVeiculos } from "./deveDesconsiderarVeiculos";

export async function sislabraExtractor(
    paginaSislabra: JSDOMType, 
    identificador: string
): Promise<ISislabraExtracted> {
    const getNome = await getInformation(paginaSislabra);

    const getVeiculosSislabra = await getVeiculos(paginaSislabra);
    const isVeiculosIrrelevantes = deveDesconsiderarVeiculos(getVeiculosSislabra);

    const getImoveisRuraisSislabra = await getImoveisRurais(paginaSislabra);
    const getEmpresaSislabra = await getEmpresa(paginaSislabra);
    const getBens = await getBensTSE(paginaSislabra);
    const getImoveisSPRaw = await getImoveisSP(paginaSislabra);
    const getEmbarcacao = await getEmbarcacoes(paginaSislabra);
    const getAeronave = await getAeronaves(paginaSislabra);

    return {
        nome: getNome,
        identificacao: identificador,
        veiculos: isVeiculosIrrelevantes ? null : getVeiculosSislabra,
        imoveisRurais: getImoveisRuraisSislabra.length > 0 ? getImoveisRuraisSislabra : null,
        empresas: getEmpresaSislabra.length > 0 ? getEmpresaSislabra : null,
        bensTse: getBens,
        imoveisSp: getImoveisSPRaw,
        embarcacao: getEmbarcacao,
        aeronave: getAeronave
    }
}