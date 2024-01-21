import { getEmpregoSislabra } from "./SislabraBusiness/GetEmpregoSislabra";
import { getImoveis } from "./SislabraBusiness/GetImoveisSp";
import { getVeiculos } from "./SislabraBusiness/GetVeiculosSislabra";

export class GetDocumentSislabraFromSapiens{
    async execute(paginaformatada: string){
        let response = "";
        const imoveisSpAutor = await getImoveis(paginaformatada);
       if(imoveisSpAutor){
            response = response + "Imoveis SP Autor"
       }

       
       const veiculos = await getVeiculos(paginaformatada)
       if(veiculos.length != 0){
        response = response + "Veiculos encontrado"
       }
       
       console.log(await getEmpregoSislabra(paginaformatada))
    }
}