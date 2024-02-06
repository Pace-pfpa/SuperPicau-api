export function calcularDiasEmprego(dataInicio: Date, dataFim: Date): number {
     // Convertendo as datas para milissegundos
     const inicioMS = dataInicio.getTime();
     const fimMS = dataFim.getTime();
 
     // Calculando a diferença em milissegundos
     const diferencaMS = fimMS - inicioMS;
 
     // Convertendo a diferença de milissegundos para dias (1 dia = 24 horas * 60 minutos * 60 segundos * 1000 milissegundos)
     const dias = diferencaMS / (1000 * 60 * 60 * 24);
 
     // Arredondando para o número inteiro mais próximo
     return Math.round(dias);
    
}