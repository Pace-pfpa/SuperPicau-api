import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";

export function identificarDivInteressados(capa: JSDOMType): number {
    const divOptions: number[] = [6, 7, 8, 9, 10]

    for (const div of divOptions) {
        const title = getXPathText(capa, `/html/body/div/div[${div}]/div/b`)
        if (title.includes('Interessados')) return div
    }

    return null
}