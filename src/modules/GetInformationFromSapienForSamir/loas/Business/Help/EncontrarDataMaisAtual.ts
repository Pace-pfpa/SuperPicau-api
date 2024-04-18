export function EncontrarDataMaisAtual(datas: Array<any>){
    
    let maiorData = datas[0]
    for(let i=1; i < datas.length; i++){
        let dataToVerificarMaiorData = datas[i]
        if(dataToVerificarMaiorData.data >= maiorData.data){
            maiorData = dataToVerificarMaiorData;
        }
    }
   
    return maiorData
}