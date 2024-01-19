import { getImoveis } from "./SislabraBusiness/GetImoveisSp";

export class GetDocumentSislabraFromSapiens{
    async execute(paginaformatada: string){
        let response = "";
        const imoveisSpAutor = await getImoveis(paginaformatada);
       if(imoveisSpAutor){
            response = response + "Imoveis SP Autor"
       }
    }
}