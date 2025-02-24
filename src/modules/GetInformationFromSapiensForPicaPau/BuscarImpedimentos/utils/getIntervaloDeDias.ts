export function getIntervaloDias(dataInicial: Date, dataFinal: Date): number {
    const diff = Math.abs(dataFinal.getTime() - dataInicial.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
}