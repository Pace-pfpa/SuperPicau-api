import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { Veiculo } from "../../dto";

export async function getVeiculos(paginaSislabra: JSDOMType): Promise<Veiculo[]> {
    const veiculosEncontrados: Veiculo[] = [];
    const marcasIndesejadas = [
        "CHEVETTE", "OPALA", "MONZA", "BRASÍLIA", "FUSCA",
        "CORCEL", "FIAT 147", "DEL REY", "BELINA", "CARAVAN",
        "KOMBI", "VARIANT", "KADETT", "ESCORT", "SANTANA",
        "CORSA", "CELTA"
    ];

    let valueWhile = true;
    let contadorPaxh = 2;
    while(valueWhile){
        const VeiculoMarca = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[5]`)
        const placaVeiculo = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[3]`)
        const renavamVeiculo = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[4]`)
        const anoFabricacaoVeiculo = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[6]`)
        const municipio = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[9]`)
        const tipoVeiculo = getXPathText(paginaSislabra, `/html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[7]`)
        const valorEstipulado = getXPathText(paginaSislabra, `/html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[10]`)
        const restricao = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[11]`)

        if (!VeiculoMarca && !tipoVeiculo) break;

        if (VeiculoMarca) {
            const marcaUpper = VeiculoMarca.toUpperCase();
            if (marcasIndesejadas.some(marcaIndesejada => marcaUpper.includes(marcaIndesejada))) {
              contadorPaxh++;
              continue;
            }
        }

        if(VeiculoMarca && !tipoVeiculo){
            veiculosEncontrados.push({
                marca: `${VeiculoMarca}`,
                tipo: "TIPO NÃO ENCONTRADO",
                valorEstipulado: valorEstipulado || "VALOR NÃO ENCONTRADO",
                placa: placaVeiculo || "PLACA NÃO ENCONTRADA",
                renavam: renavamVeiculo || "RENAVAM NÃO ENCONTRADO",
                anoFabricacao: anoFabricacaoVeiculo || "ANO DE FABRICAÇÃO NÃO ENCONTRADO",
                municipio: municipio || "MUNICÍPIO NÃO ENCONTRADO",
                restricao: restricao,
            })
        }

        if(!VeiculoMarca && tipoVeiculo){
            if(tipoVeiculo.trim() != "MOTOCICLETA"){
                veiculosEncontrados.push({
                    marca: "MARCA NÃO ENCONTRADO",
                    tipo: `${tipoVeiculo}`,
                    valorEstipulado: valorEstipulado || "VALOR NÃO ENCONTRADO",
                    placa: placaVeiculo || "PLACA NÃO ENCONTRADA",
                    renavam: renavamVeiculo || "RENAVAM NÃO ENCONTRADO",
                    anoFabricacao: anoFabricacaoVeiculo || "ANO DE FABRICAÇÃO NÃO ENCONTRADO",
                    municipio: municipio || "MUNICÍPIO NÃO ENCONTRADO",
                    restricao: restricao,
                })
            }
            
        }

        if(VeiculoMarca && tipoVeiculo){
            if(tipoVeiculo.trim() != "MOTOCICLETA"){
                veiculosEncontrados.push({
                    marca: `${VeiculoMarca}`,
                    tipo: `${tipoVeiculo}`,
                    valorEstipulado: valorEstipulado || "VALOR NÃO ENCONTRADO",
                    placa: placaVeiculo || "PLACA NÃO ENCONTRADA",
                    renavam: renavamVeiculo || "RENAVAM NÃO ENCONTRADO",
                    anoFabricacao: anoFabricacaoVeiculo || "ANO DE FABRICAÇÃO NÃO ENCONTRADO",
                    municipio: municipio || "MUNICÍPIO NÃO ENCONTRADO",
                    restricao: restricao,
                })
            }
        }

        contadorPaxh += 1;

    }

    return veiculosEncontrados
}
