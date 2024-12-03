import { loasEmpregoDossie, loasLitispendencia, restabelecimentoRequerimentosDossie } from "./Business";

export class LoasDossieUseCase{
    constructor(){}
    async execute(parginaDoesprev: any, paginaDosprevFormatada: any){
        try{

            return await restabelecimentoRequerimentosDossie.handle(paginaDosprevFormatada)
        }catch(e){
            return e
        }
    }

    async executeLitispendenciaDossie(parginaDoesprev: any, paginaDosprevFormatada: any){
        try{
            
            return await loasLitispendencia.handle(paginaDosprevFormatada);


        }catch(e){
            return e
        }
    }



    async executeEmprego(parginaDoesprev: any, paginaDosprevFormatada: any):  Promise<boolean | object>{
        return await loasEmpregoDossie.execute(paginaDosprevFormatada)
    }
}