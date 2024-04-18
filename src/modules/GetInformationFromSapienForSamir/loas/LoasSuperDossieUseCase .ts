import { restabelecimentoRequerimentosDossie, restabelecimentoRequerimentosSuperDossie } from "./Business";

export class LoasSuperDossieUseCase {
    constructor(){}
    async execute(parginaDoesprev: any, paginaDosprevFormatada: any){
        try{

            return  await restabelecimentoRequerimentosSuperDossie.handle(paginaDosprevFormatada)
        }catch(e){
            return e
        }
    }
}