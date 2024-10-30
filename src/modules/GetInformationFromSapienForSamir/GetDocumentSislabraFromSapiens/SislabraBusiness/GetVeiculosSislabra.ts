import { Veiculo } from "../../../../DTO/IResponseSislabra";
import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export async function getVeiculos(paginaSislabra: string): Promise<Veiculo[]> {
    ///html/body/div/main/div/div[11]/table/tbody/tr[2]/td[5]
    ///html/body/div/main/div/div[11]/table/tbody/tr[2]/td[5]
    ///html/body/div/main/div/div[11]/table/tbody/tr[3]/td[10]

    const veiculosEncontrados: Veiculo[] = [];
    let valueWhile = true;
    let contadorPaxh = 2;
    while(valueWhile){
        const VeiculoMarca = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[5]`)
        const tipoVeiculo = getXPathText(paginaSislabra, `/html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[7]`)
        const valorEstipulado = getXPathText(paginaSislabra, `/html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[10]`)

        if(!VeiculoMarca && !tipoVeiculo){
            break;
        }

        if(VeiculoMarca && !tipoVeiculo){
            veiculosEncontrados.push({
                Marca: `${VeiculoMarca}`,
                Tipo: "TIPO NÃO ENCONTRADO",
                ValorEstipulado: valorEstipulado || "VALOR NÃO ENCONTRADO",
            })
        }

        if(!VeiculoMarca && tipoVeiculo){
            if(tipoVeiculo.trim() != "MOTOCICLETA"){
                veiculosEncontrados.push({
                    Marca: "MARCA NÃO ENCONTRADO",
                    Tipo: `${tipoVeiculo}`,
                    ValorEstipulado: valorEstipulado || "VALOR NÃO ENCONTRADO",
                })
            }
            
        }

        if(VeiculoMarca && tipoVeiculo){
            if(tipoVeiculo.trim() != "MOTOCICLETA"){
                veiculosEncontrados.push({
                    Marca: `${VeiculoMarca}`,
                    Tipo: `${tipoVeiculo}`,
                    ValorEstipulado: valorEstipulado || "VALOR NÃO ENCONTRADO",
                })
            }
            
        }

        contadorPaxh += 1;

    }
    return veiculosEncontrados
    
}


