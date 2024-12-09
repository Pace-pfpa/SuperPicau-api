import { renderTable } from "./renderTable";

export const renderSecao = (
    titulo: string,
    mensagem: string,
    dadosAutor: any[] | undefined,
    dadosConjuge: any[] | undefined,
    colunas: string[],
    tituloAutor: string,
    tituloConjuge: string
): string => {
    const hasDados = (dadosAutor?.length ?? 0) > 0 || (dadosConjuge?.length ?? 0) > 0;

    if (!hasDados) {
        return "";
    }

    return `
        <p>
            <strong><span>${titulo}</span></strong>:
            ${mensagem}
        </p>
        ${renderTable(dadosAutor ?? [], tituloAutor, colunas)}
        ${renderTable(dadosConjuge ?? [], tituloConjuge, colunas)}
    `;
}