export function EncontrarDataCesSusMaisAtual(datas: Array<any>){

    const cessaoOuSuspensoDatas = datas.filter(item => item.beneficio === "cessaoOuSuspenso");

    // Verifica se existem objetos com beneficio "cessaoOuSuspenso"
    if (cessaoOuSuspensoDatas.length === 0) {
        return "Nenhum objeto com benefício 'cessaoOuSuspenso' encontrado";
    }

    let maiorData = cessaoOuSuspensoDatas[0];
    for(let i = 1; i < cessaoOuSuspensoDatas.length; i++){
        let dataToVerificarMaiorData = cessaoOuSuspensoDatas[i];
        if(dataToVerificarMaiorData.data >= maiorData.data){
            maiorData = dataToVerificarMaiorData;
        }
    }
   
    return maiorData.data;
}