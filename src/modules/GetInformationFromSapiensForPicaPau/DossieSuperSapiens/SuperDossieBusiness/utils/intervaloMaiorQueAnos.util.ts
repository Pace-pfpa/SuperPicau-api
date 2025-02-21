/**
 * Função para verificar se o intervalo entre duas datas é maior que um valor especificado em anos.
 * @param dataInicial A data inicial no formato Date.
 * @param dataFinal A data final no formato Date.
 * @param anos O valor em anos a ser comparado.
 * @returns Retorna `true` se o intervalo for maior que o valor em anos, caso contrário, `false`.
 */
export function intervaloMaiorQueAnos(dataInicial: Date, dataFinal: Date, anos: number): boolean {
    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

    const milissegundosEmUmAno = 1000 * 60 * 60 * 24 * 365.25;
    const diferencaEmAnos = diferencaEmMilissegundos / milissegundosEmUmAno;

    return diferencaEmAnos > anos;
}