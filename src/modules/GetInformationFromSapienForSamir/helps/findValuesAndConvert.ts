export function convertCurrencyStringsToNumbers(datesStr: string): number[] {
    const currencyRegex = /\b\d{1,3}(?:\.\d{3})*,\d{2}\b|\b\d+,\d{2}\b|\b(?![0-3][0-9]\/)\d{4}(?!\/\d{2})\b/g;

    const matches = datesStr.match(currencyRegex);

    if (!matches) {
        return [];
    }

    return matches.map(value => {
        // Verifica se o valor é um número de quatro dígitos isolado
        if (/^\d{4}$/.test(value)) {
            return parseInt(value, 10);
        }

        // Converte valores no formato monetário
        const numericValue = value.replace(/\./g, '').replace(',', '.');
        return parseFloat(numericValue);
    });
}
