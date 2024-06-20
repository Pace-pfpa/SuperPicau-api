type Interval = {
    seq: string;
    dataInicio: Date;
    dataFim: Date | null;
  };

export function isDateInRange(relacoes: Interval[], dateToCheck: Date): string {
    
    for (const interval of relacoes) {
        const { seq, dataInicio, dataFim } = interval;
        if (dateToCheck >= dataInicio && (dataFim === null || dateToCheck <= dataFim)) {
            return seq;
        }
    }
    
    return null
    
}