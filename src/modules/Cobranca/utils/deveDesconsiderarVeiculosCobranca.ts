import { Veiculo } from "../../GetInformationFromSapiensForPicaPau/dto";

export function deveDesconsiderarVeiculosCobranca(
    veiculos: Veiculo[]
): { deveDesconsiderar: boolean; veiculosConsiderados: Veiculo[] } {
    const veiculosConsiderados = veiculos.filter((veiculo) => {
        const anoFabricacao = parseInt(veiculo.anoFabricacao.split('/')[0]);

        if (veiculo.tipo === 'AUTOMOVEL' || veiculo.tipo === 'MOTO' || veiculo.tipo === 'MOTOCICLETA') {
            return anoFabricacao >= 2015;
        } else {
            return anoFabricacao >= 2000
        }
    });

    const deveDesconsiderar = veiculosConsiderados.length !== veiculos.length;

    return {
        deveDesconsiderar,
        veiculosConsiderados
    }
}