export function converterStringToNumber(valorFormatado: string): number {
    let valorLimpo = valorFormatado.replace("R$", "").trim();
    valorLimpo = valorLimpo.replace(/\./g, "");
    valorLimpo = valorLimpo.replace(",", ".");
    return parseFloat(valorLimpo);
}