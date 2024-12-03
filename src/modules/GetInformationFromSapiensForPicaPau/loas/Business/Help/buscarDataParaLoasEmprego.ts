export function buscarDataParaLoasEmprego(dataInicio: Date, dataFim: Date, dataInicioPrevidenciarias?: Date, dataFimPrevidenciarias?: Date): boolean{

    console.log(dataFim)
    console.log(dataInicio)
    if(!dataInicioPrevidenciarias){
        if(dataInicio <= dataFimPrevidenciarias && dataFimPrevidenciarias <= dataFim){
            return true;
        }
    }

    if(!dataFimPrevidenciarias){
        if(dataInicio <= dataInicioPrevidenciarias && dataInicioPrevidenciarias <= dataFim){
            return true;
        }
    }


    if((dataInicio >= dataInicioPrevidenciarias && dataFimPrevidenciarias > dataFim) || (dataInicio <= dataInicioPrevidenciarias && dataInicioPrevidenciarias <= dataFim) || 
        (dataInicio >= dataInicioPrevidenciarias && dataInicioPrevidenciarias >= dataFim && dataFimPrevidenciarias >= dataInicio)){
        return true;
    }

    return false;

}