import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { Empresa } from "../../dto";
                                        
export async function getEmpresa(paginaSislabra: JSDOMType): Promise<Empresa[]> {
        const empresasEncontradas: Empresa[] = [];
        let valueWhile = true;
        let contadorXPath = 2;

        // Busca pela 2 tabela de empresa
        while (valueWhile) {
            const nomeVinculadoEmpresa = getXPathText(paginaSislabra, `/html/body/div/main/div/div[7]/table/tbody/tr[${contadorXPath}]/td[2]`);
            const cpfOuCnpjEmpresa = getXPathText(paginaSislabra, `/html/body/div/main/div/div[7]/table/tbody/tr[${contadorXPath}]/td[3]`);
            const tipoDeVinculoEmpresa = getXPathText(paginaSislabra, `/html/body/div/main/div/div[7]/table/tbody/tr[${contadorXPath}]/td[11]`);
            const dataEntradaEmpresa = getXPathText(paginaSislabra, `/html/body/div/main/div/div[7]/table/tbody/tr[${contadorXPath}]/td[4]`);

            if (!nomeVinculadoEmpresa) {
                break;
            }

            empresasEncontradas.push({
                nomeVinculado: nomeVinculadoEmpresa,
                cpfOuCnpj: cpfOuCnpjEmpresa || "CPF/CNPJ NÃO ENCONTRADO",
                tipoDeVinculo: tipoDeVinculoEmpresa || "TIPO DE VÍNCULO NÃO ENCONTRADO",
                dataEntrada: dataEntradaEmpresa || "DATA DE ENTRADA NA SOCIEDADE NÃO ENCONTRADA",
            });

            contadorXPath += 1;

        }

        if (empresasEncontradas.length === 0) {
            let valueWhile = true;
            let contadorXPath = 2;

            // Busca pela 1 tabela de empresa
            while (valueWhile) {
                const nomeVinculadoEmpresa1 = getXPathText(paginaSislabra, `/html/body/div/main/div/div[6]/table/tbody/tr[${contadorXPath}]/td[2]`);
                const cpfOuCnpjEmpresa1 = getXPathText(paginaSislabra, `/html/body/div/main/div/div[6]/table/tbody/tr[${contadorXPath}]/td[3]`);
                const tipoDeVinculoEmpresa1 = getXPathText(paginaSislabra, `/html/body/div/main/div/div[6]/table/tbody/tr[${contadorXPath}]/td[4]`);
                const dataEntradaEmpresa1 = getXPathText(paginaSislabra, `/html/body/div/main/div/div[6]/table/tbody/tr[${contadorXPath}]/td[5]`);

                if (!nomeVinculadoEmpresa1) {
                    break;
                }

                empresasEncontradas.push({
                    nomeVinculado: nomeVinculadoEmpresa1,
                    cpfOuCnpj: cpfOuCnpjEmpresa1 || "CPF/CNPJ NÃO ENCONTRADO",
                    tipoDeVinculo: tipoDeVinculoEmpresa1 || "TIPO DE VÍNCULO NÃO ENCONTRADO",
                    dataEntrada: dataEntradaEmpresa1 || "DATA DE ENTRADA NA SOCIEDADE NÃO ENCONTRADA",
                });
    
                contadorXPath += 1;

            }
        }

        const uniqueArray = empresasEncontradas.filter((value, index, self) =>
            index === self.findIndex((obj) => 
                obj.cpfOuCnpj === value.cpfOuCnpj && 
                obj.tipoDeVinculo === value.tipoDeVinculo && 
                obj.nomeVinculado === value.nomeVinculado &&
                obj.dataEntrada === value.dataEntrada
            )
        );

        return uniqueArray;
    }
    


