export function isProcessoLimpo(impeditivos: string[]): boolean {
    const relevantes = impeditivos.filter(imp => imp.trim() !== '' && !imp.includes('*RURAL*') && !imp.includes('*MATERNIDADE*') && !imp.includes('*LOAS*'));
    return relevantes.length === 0;
}
