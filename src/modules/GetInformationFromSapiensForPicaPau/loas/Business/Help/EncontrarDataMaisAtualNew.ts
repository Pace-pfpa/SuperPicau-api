export function EncontrarDataMaisAtualNew(datas: Array<any>){
    
    let maiorData = datas[0]
    console.log(datas)
    for(let i=1; i < datas.length; i++){
        console.log(datas.length)
        let dataToVerificarMaiorData = datas[i]
        if(dataToVerificarMaiorData.data >= maiorData.data){
            console.log(dataToVerificarMaiorData)
            console.log(maiorData)
            maiorData = dataToVerificarMaiorData;
        }
    }
   
    return maiorData
}