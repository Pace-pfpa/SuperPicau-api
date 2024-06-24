export function convertCurrencyStringsToNumbers(datesStr: string): number[] {

    const currencyRegex = /\b\d{1,3}(?:\.\d{3})*,\d{2}\b|\b\d+,\d{2}\b/g;

    const matches = datesStr.match(currencyRegex);

    if (!matches) {
        return [];
    }

    return matches.map(value => {

        const numericValue = value.replace(/\./g, '').replace(',', '.');

        return parseFloat(numericValue);
    });
}