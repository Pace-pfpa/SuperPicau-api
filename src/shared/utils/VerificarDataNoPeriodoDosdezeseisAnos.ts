export function verificarDataNoPeriodoDeDezesseisAnos(dataMaisAtual: Date, dataMenosDezesseisAnos: Date, dataInicioPrevidenciarias: Date, dataFimPrevidenciarias: Date): boolean{
    if(dataInicioPrevidenciarias >= dataMenosDezesseisAnos && dataInicioPrevidenciarias <= dataMaisAtual || dataFimPrevidenciarias >= dataMenosDezesseisAnos && dataFimPrevidenciarias <= dataMaisAtual){
        return true;
    }else if(dataInicioPrevidenciarias < dataMenosDezesseisAnos && dataFimPrevidenciarias > dataMaisAtual){
        return true;
    }else if(dataInicioPrevidenciarias < dataMenosDezesseisAnos && dataFimPrevidenciarias > dataMenosDezesseisAnos){
        return true;
    }
    return false;
}