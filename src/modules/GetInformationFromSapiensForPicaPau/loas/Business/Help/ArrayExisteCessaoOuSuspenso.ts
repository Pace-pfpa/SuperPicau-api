export function arrayExisteCessadoOuSuspenso(data: Array<any>){
    for( let i = 0; i< data.length; i++){
        const valueBneficio = data[0].beneficio == "cessaoOuSuspenso"
        if(valueBneficio) return valueBneficio
    }
    return false
}