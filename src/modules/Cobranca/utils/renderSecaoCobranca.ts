import { renderTable } from "../../CreateHtmlForRM/utils";

export const renderSecaoCobranca = (
    encontrado: boolean,
    titulo: string,
    dados: any[] | undefined,
    colunas: string[],
    tituloCobrado: string,
): string => {
    if (!encontrado) return "";

    return `
        <p>
            <strong><span>${titulo}</span></strong>:
            <p><br><p>
        </p>
        ${renderTable(dados, tituloCobrado, colunas)}
    `;
}