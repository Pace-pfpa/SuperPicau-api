const { JSDOM } = require('jsdom');

import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { CorrigirCpfComZeros } from "../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getDocumentoUseCase } from "../../GetDocumento";

export async function verificarDossieMaisAtual(cpf: string, cookie:string ,normalDossie?: any[], superDossie?: any[]){

    
 try{
     if(normalDossie && !superDossie){
         for(let i = 0; i < normalDossie.length; i++){
             let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
             if(objetoDosprev){
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             }
     
             const idDosprevParaPesquisa = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
             const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
     
             const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 
     
             const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
             const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);
     
             if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
             if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                 console.log("retornou")
                 return [normalDossie[i], 0]
             }    
         }
     }
     
     
     if(!normalDossie && superDossie){
         for(let i = 0; i < superDossie.length; i++){
            console.log("exectou")
             try{
                 console.log("ahdkjasjagjydgadjyasfgdsahtdfah")
                 const idDosprevParaPesquisa = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                 const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
               
                 const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 
         
                 const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                 const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);
                 console.log('----CPF DOSPREV: ')
                 console.log(cpfDosprev)
                 
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                    
                 if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                     return [superDossie[i], 1]
                 }    
                 
             }catch(e){
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             }
             /* let objetoDosprev =  (normalDossie[i].documentoJuntado.componentesDigitais[0] == undefined)  || (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
             
             if(objetoDosprev){
                 console.log("erro aquiiiiiiiiiii")
                 return new Error("DOSPREV COM FALHA NA PESQUISA")
             } */
     
         }
     }
     
     if(normalDossie && superDossie){
        console.log("23213213")
        //console.log(normalDossie[0].documentoJuntado)
        //console.log(superDossie[0].documentoJuntado)
        console.log(normalDossie.length)
        console.log(superDossie)
        console.log("23213213")
         if(normalDossie.length >= superDossie.length){
             for(let i=0; i < superDossie.length; i++){
                
                 let objetoDosprevNormal =  (normalDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id) 
                 
                
                 let objetoDosprevSuper = (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!superDossie[i].documentoJuntado.componentesDigitais[0].id)
     
                 
                

                 if(objetoDosprevNormal && !objetoDosprevSuper){
                    console.log("entrou no primeiro if")
                    const idDosprevParaPesquisaDossieSuper = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                    const parginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
    
                    const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieSuper); 
    
    
    
                    const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                    const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);
    
                    if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
    
                    if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                        return [superDossie[i], 1]
                    }    
                 } else if(objetoDosprevSuper && !objetoDosprevNormal){

                    const idDosprevParaPesquisaDossieNormal = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
                     const parginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });
     
                     const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieNormal); 
     
     
                     const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
                     const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);
     
                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                     if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                         return [normalDossie[i], 0]
                     }    


                 }else{



                    if(normalDossie[i].numeracaoSequencial > superDossie[i].numeracaoSequencial){
                     
     
                        const idDosprevParaPesquisaDossieNormal = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
                        const parginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });
        
                        const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieNormal); 
        
        
                        const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
                        const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);
        
                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
        
                        if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                            return [normalDossie[i], 0]
                        }    
        
        
                    }else{
        
                        const idDosprevParaPesquisaDossieSuper = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                        const parginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
        
                        const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieSuper); 
        
        
        
                        const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                        const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);
        
                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
        
                        if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
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
     
                 const idDosprevParaPesquisa = normalDossie[i].documentoJuntado.componentesDigitais[0].id;
                 const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
     
                 const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 
     
                 const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
                 const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);
     
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                 if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                     return [normalDossie[i], 1]
                 }    
     
     
     
     
     
             }
     
     
     
     
     
     
     
         }else{
            // INZAGHI

            console.log('---NORMAL: ')
            console.log(superDossie)

            const superDossieSorted = superDossie.sort((a, b) => a.numeracaoSequencial - b.numeracaoSequencial)

            console.log('---SORTED: ')
            console.log(superDossieSorted)
            

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
     
                     const idDosprevParaPesquisaDossieNormal = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                     const parginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });
     
                     const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieNormal); 
     
     
                     const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                     const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);
     
                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
     
                     if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                         return [normalDossie[i], 0]
                     }    
     
     
                 }else{
                     const idDosprevParaPesquisaDossieSuper = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                     const parginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
    

                     const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieSuper); 
      
                     const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                     const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

                     if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                        
                     // AO ENCONTRAR O CPF, COMPARAR COM O DA CAPA, SE FOR DIFERENTE FAZER OUTRA BUSCA.

                     // ENCONTRA UM DOSSIÊ DE OUTRA PESSOA PRIMEIRO E NÃO CAI NESSE IF   
                     if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                        
                        return [superDossie[i], 1]

                     } else {
                        const idDosprevParaPesquisaDossieSuper = superDossieSorted[i].documentoJuntado.componentesDigitais[0].id;
                        const parginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
    

                        const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieSuper); 
      
                        const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                        const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

                        if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
                        
                        if (cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())) {
                            return [superDossieSorted[i], 1]
                        }    
                     }    
     
                 }
     
             }
     
     
     
     
             for(let i = 0; i < superDossie.length; i++){
                 let objetoDosprev =  (superDossie[i].documentoJuntado.componentesDigitais.length) <= 0 ||  (!normalDossie[i].documentoJuntado.componentesDigitais[0].id)
         
                 if(objetoDosprev){
                     return new Error("DOSPREV COM FALHA NA PESQUISA")
                 }
         
                 const idDosprevParaPesquisa = superDossie[i].documentoJuntado.componentesDigitais[0].id;
                 const parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
         
                 const parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 
         
                 const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
                 const cpfDosprev = getXPathText(parginaDosPrevFormatada, xpathCpfDosprev);
         
                 if(!cpfDosprev) return new Error("cpf com falha na pesquisa dosprev")
         
                 if(cpf.trim() == CorrigirCpfComZeros(cpfDosprev.trim())){
                     return [superDossie[i], 1]
                 }    
             }
     
     
     
     
     
         }
     
     
     }
     
     


 }  catch(e){
    return new Error("DOSPREV COM FALHA NA PESQUISA")
 }     


 




}