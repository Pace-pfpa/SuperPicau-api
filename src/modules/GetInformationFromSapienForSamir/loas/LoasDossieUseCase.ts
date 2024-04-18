import { restabelecimentoRequerimentosDossie } from "./Business";

export class LoasDossieUseCase{
    constructor(){}
    async execute(parginaDoesprev: any, paginaDosprevFormatada: any){
        try{

            return await restabelecimentoRequerimentosDossie.handle(paginaDosprevFormatada)
        }catch(e){
            return e
        }
    }
}