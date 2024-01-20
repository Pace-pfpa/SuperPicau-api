import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export async function getVeiculos(paginaSislabra: string): Promise<Array<any>> {
    ///html/body/div/main/div/div[11]/table/tbody/tr[2]/td[5]
    ///html/body/div/main/div/div[11]/table/tbody/tr[2]/td[5]
    const veiculosEncontrados = [];
    let valueWhile = true;
    let contadorPaxh = 2;
    while(valueWhile){
        const VeiculoMarca = getXPathText(paginaSislabra, `html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[5]`)
        const tipoVeiculo = getXPathText(paginaSislabra, `/html/body/div/main/div/div[11]/table/tbody/tr[${contadorPaxh}]/td[7]`)

        if(!VeiculoMarca && !tipoVeiculo){
            break;
        }

        if(VeiculoMarca && !tipoVeiculo){
            veiculosEncontrados.push({
                "Marca": `${VeiculoMarca}`,
                "Tipo": "TIPO NÃO ENCONTRADO"
            })
        }

        if(!VeiculoMarca && tipoVeiculo){
            veiculosEncontrados.push({
                "Marca": "MARCA NÃO ENCONTRADO",
                "Tipo": `${tipoVeiculo}`
            })
        }

        if(VeiculoMarca && tipoVeiculo){
            veiculosEncontrados.push({
                "Marca": `${VeiculoMarca}`,
                "Tipo": `${tipoVeiculo}`
            })
        }

        contadorPaxh = contadorPaxh + 1

    }
    return veiculosEncontrados
    
}


