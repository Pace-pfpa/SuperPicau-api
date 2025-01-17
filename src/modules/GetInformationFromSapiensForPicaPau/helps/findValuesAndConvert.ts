export function convertCurrencyStringsToNumbers(datesStr: string): number[] {
    const currencyRegexPart1 = /\b\d{1,3}(?:\.\d{3})*,\d{2}\b/;
    const currencyRegexPart2 = /\b\d+,\d{2}\b/;
    const yearRegex = /\b(?!\d{1,2}\/)\d{4}(?!\/\d{1,2})\b/;

    const currencyRegex = new RegExp(
        `${currencyRegexPart1.source}|${currencyRegexPart2.source}|${yearRegex.source}`,
        'g'
    );

    const matches: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = currencyRegex.exec(datesStr)) !== null) {
        matches.push(match[0]);
    }

    if (matches.length === 0) {
        return [];
    }

    return matches.map(value => {
        // Verifica se o valor é um número de quatro dígitos isolado
        if (yearRegex.test(value)) {
            return parseInt(value, 10);
        }

        if (currencyRegexPart1.test(value) || currencyRegexPart2.test(value)) {
            const numericValue = value.replace(/\./g, '').replace(',', '.');
            return parseFloat(numericValue);
        }

        return 0;
    });
}
