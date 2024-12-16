import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { IIdadeDTO } from "./dtos/IIdadeDTO";

export class CalcularIdadeNewDossie {
    async calcIdade(parginaDosPrevFormatada: JSDOMType): Promise<{idadeImpeditivo: boolean; idadeAutor: IIdadeDTO}> {
        const dataNascXpath: string = "/html/body/div/div[4]/table/tbody/tr[8]/td";
        const dataAjuizXpath: string = "/html/body/div/div[4]/table/tbody/tr[2]/td";
        const generoXptah: string = "/html/body/div/div[4]/table/tbody/tr[11]/td"
        const dataAjuizFormatado: string = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, dataAjuizXpath));
        const dataNascFormatado: string = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, dataNascXpath));
        const generoFormatado: string = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, generoXptah));
        
        if(generoFormatado == null){
            console.error("ENTROU IDADE NULL")
            return null;
        }
        
        if(generoFormatado.length == 0){
            console.error("ENTROU IDADE VAZIA")
            return null;
        }
        
        let dataAjuizArray = dataAjuizFormatado.split("/");
        let year = parseFloat(dataAjuizArray[2])
        let month = parseFloat(dataAjuizArray[1])
        let day = parseFloat(dataAjuizArray[0])


        let ano_atual = year,
            mes_atual = month + 1,
            dia_atual = day,
            split = dataNascFormatado.split('/'),
            novadata = split[1] + "/" +split[0]+"/"+split[2],
            data_americana = new Date(novadata),
            vAno = data_americana.getFullYear(),
            vMes = data_americana.getMonth() + 1,
            vDia = data_americana.getDate(),
            ano_aniversario = +vAno,
            mes_aniversario = +vMes,
            dia_aniversario = +vDia,
            quantos_anos = ano_atual - ano_aniversario;
        if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
            quantos_anos--;
        }
        const idade = quantos_anos < 0 ? 0 : quantos_anos;

        console.log("SEM IDADE É FODA")
        console.log(generoFormatado)
        console.log(idade)

        if (generoFormatado === "MASCULINO" && idade < 60) {
            return {
                idadeImpeditivo: true,
                idadeAutor: {
                    dataAjuizamento: dataAjuizFormatado,
                    dataNascimento: dataNascFormatado,
                    idade: idade
                }
            }
        }

        if (generoFormatado === "FEMININO" && idade < 55) {
            return {
                idadeImpeditivo: true,
                idadeAutor: {
                    dataAjuizamento: dataAjuizFormatado,
                    dataNascimento: dataNascFormatado,
                    idade: idade
                }
            }
        }

        return {
            idadeImpeditivo: false,
            idadeAutor: {
                dataAjuizamento: null,
                dataNascimento: null,
                idade: null
            }
        }
        
    }

}
