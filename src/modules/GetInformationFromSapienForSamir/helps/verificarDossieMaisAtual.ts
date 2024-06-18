const { JSDOM } = require('jsdom');

import { CorrigirCpfComZeros } from "../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getCPFDosPrevNormal } from "./getCPFDosPrevNormal";
import { getCPFDosPrevSuper } from "./getCPFDosPrevSuper";

export async function verificarDossieMaisAtual(cpf: string, cookie:string ,normalDossie?: any[], superDossie?: any[]){

    
 try{
     if(normalDossie && !superDossie){

         for(let i = 0; i < normalDossie.length; i++){
             let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
             if(objetoDosprev){
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             }

             const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
             if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
             if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                 console.log("retornou")
                 return [normalDossie[i], 0]
             }    
         }
     }
     
     
     if(!normalDossie && superDossie){
         for(let i = 0; i < superDossie.length; i++){
            console.log("exectou")
             try{

                 const cpfDosprev = getCPFDosPrevSuper(superDossie[i], cookie)
                 console.log('----CPF DOSPREV: ')
                 console.log(cpfDosprev)
                 
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                    
                 if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                     return [superDossie[i], 1]
                 }    
                 
             }catch(e){
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             }
     
         }
     }
     
     if(normalDossie && superDossie){
        console.log("23213213")
        //console.log(normalDossie[0].documentoJuntado)
        //console.log(superDossie[0].documentoJuntado)
        console.log(normalDossie.length)
        console.log(superDossie.length)
        console.log("23213213")
         if(normalDossie.length >= superDossie.length){
             for(let i=0; i < superDossie.length; i++){
                
                 let objetoDosprevNormal =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
                 
                
                 let objetoDosprevSuper = (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!superDossie[i].documentoJuntado.componentesDigitais[0].id)
     
                 
                

                 if(objetoDosprevNormal && !objetoDosprevSuper){

                    const cpfDosprev = getCPFDosPrevSuper(superDossie[i], cookie)
    
                    if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
    
                    if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                        return [superDossie[i], 1]
                    }

                 } else if (objetoDosprevSuper && !objetoDosprevNormal){

                     const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                     if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                         return [normalDossie[i], 0]
                     }    


                 } else {

                    if(normalDossie[i].numeracaoSequencial > superDossie[i].numeracaoSequencial){
                
                        const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
        
                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
        
                        if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                            return [normalDossie[i], 0]
                        }    
        
        
                    }else{

                        const cpfDosprev = getCPFDosPrevSuper(superDossie[i], cookie)

                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
        
                        if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                            return [superDossie[i], 1]
                        }    
        
                    }

                 }
     
             }
     
     
             for(let i = 0; i < normalDossie.length; i++){
     
                 let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
     
                 if(objetoDosprev){
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }
                 
                 
                 const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                 if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                     return [normalDossie[i], 1]
                 }    
     
             }
     
     
         }else{

            console.log('---NORMAL: ')
            //console.log(superDossie)

            const superDossieSorted = superDossie.sort((a, b) => a.numeracaoSequencial - b.numeracaoSequencial)

            console.log('---SORTED: ')
            //console.log(superDossieSorted)
            

             for(let i=0; i < normalDossie.length; i++){
                
                 let objetoDosprevNormal =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 

                 if(objetoDosprevNormal){
                    console.log('-----CAIU AQUI? 2')
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }
     
                
                 let objetoDosprevSuper = (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
     
                 if(objetoDosprevSuper){
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }
     
     
                 if(normalDossie[i].numeracaoSequencial > superDossie[i].numeracaoSequencial){

                     const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
     
                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                     if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                         return [normalDossie[i], 0]
                     }    
     
     
                 }else{

                     const cpfDosprevSuper = getCPFDosPrevSuper(superDossie[i], cookie)

                     if(!cpfDosprevSuper) return new Error("cpf com falha na pesquisa dosprev")

                     // INZAGHI: inverte e pega o CPF do DOSPREV mais antigo (garantido de ser o do requerente).
                     if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprevSuper).trim())){
                        
                        return [superDossie[i], 1]

                     } else {
                        
                        const cpfDosprev = getCPFDosPrevSuper(superDossieSorted[i], cookie)

                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                        
                        if (cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())) {
                            return [superDossieSorted[i], 1]
                        }    
                     }
                     
                    // SHEVCHENKO: se não retornar pelo if de cima é um SHEVCHENKO.
                    const cpfDosprev = getCPFDosPrevNormal(normalDossie[i], cookie)
    
                    if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
    
                    if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                        return [normalDossie[i], 0]
                    }


                 }
     
             }
     
     
             for(let i = 0; i < superDossie.length; i++){
                 let objetoDosprev =  (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
         
                 if(objetoDosprev){
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }

                 const cpfDosprev = getCPFDosPrevSuper(superDossie[i], cookie)
         
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
         
                 if(cpf.trim() == CorrigirCpfComZeros((await cpfDosprev).trim())){
                     return [superDossie[i], 1]
                 }    
             }
     
     
     
     
     
         }
     
     
     }
     
     


 }  catch(e){
    return new Error("DOSPREV COM FALHA NA PESQUISA")
 }     


 




}