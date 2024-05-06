import { loasEmpregoSuperDossie, loasLitispendenciaSuperDossie, restabelecimentoRequerimentosDossie, restabelecimentoRequerimentosSuperDossie } from "./Business";

export class LoasSuperDossieUseCase {
    constructor(){}
    async execute(parginaDoesprev: any, paginaDosprevFormatada: any){
        try{

            return  await restabelecimentoRequerimentosSuperDossie.handle(paginaDosprevFormatada)
        }catch(e){
            return e
        }
    }


    async executeLitispendenciaSuperDossie(parginaDoesprev: any, paginaDosprevFormatada: any){
        try{

            return await loasLitispendenciaSuperDossie.handle(paginaDosprevFormatada);


        }catch(e){
            return e
        }
    }


    async executeEmprego(parginaDoesprev: any, paginaDosprevFormatada: any):  Promise<boolean | object>{
        return await loasEmpregoSuperDossie.execute(paginaDosprevFormatada)
    }
}