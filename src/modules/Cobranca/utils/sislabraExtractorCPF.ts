import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getInformation } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/getInformation";
import { getVeiculos } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetVeiculosSislabra";
import { getEmpresa } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetEmpresaSislabra";
import { CobrancaLabrasExtracted } from "../types/CobrancaLabrasExtracted.type";
import { deveDesconsiderarVeiculosCobranca } from "./deveDesconsiderarVeiculosCobranca";
import { getBensTSE } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetBensTSE";
import { getAeronaves } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetAeronavesSislabra";
import { getEmbarcacoes } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetEmbarcacoesSislabra";
import { getImoveisRurais } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetImoveisRuraisSislabra";
import { getImoveisSP } from "../../GetInformationFromSapiensForPicaPau/GetDocumentSislabraFromSapiens/SislabraBusiness/GetImoveisSp";


export async function sislabraExtractorCPF(
    paginaSislabra: JSDOMType
): Promise<CobrancaLabrasExtracted> {
    const getNome = await getInformation(paginaSislabra);

    const getEmpresaSislabra = await getEmpresa(paginaSislabra);
    const getBens = await getBensTSE(paginaSislabra);

    const getVeiculosSislabra = await getVeiculos(paginaSislabra);
    const isVeiculosIrrelevantes = deveDesconsiderarVeiculosCobranca(getVeiculosSislabra);

    const getImoveisSPRaw = await getImoveisSP(paginaSislabra);
    const getImoveisRuraisSislabra = await getImoveisRurais(paginaSislabra);
    const getEmbarcacao = await getEmbarcacoes(paginaSislabra);
    const getAeronave = await getAeronaves(paginaSislabra);

    return {
        nome: getNome,
        empresas: getEmpresaSislabra.length > 0 ? getEmpresaSislabra : null,
        bensTse: getBens,
        veiculos: isVeiculosIrrelevantes.deveDesconsiderar ? isVeiculosIrrelevantes.veiculosConsiderados : null,
        imoveisSp: getImoveisSPRaw,
        imoveisRurais: getImoveisRuraisSislabra.length > 0 ? getImoveisRuraisSislabra : null,
        embarcacao: getEmbarcacao,
        aeronave: getAeronave,
    }
}