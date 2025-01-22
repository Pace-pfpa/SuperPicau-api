import { renderTable } from "..";

export const renderSecaoLoas = (
    titulo: string,
    mensagem: string,
    dadosAutor: any[] | undefined,
    dadosGF: any[] | undefined,
    colunas: string[],
    tituloAutor: string,
    tituloGF: string
): string => {
    const hasDados = (dadosAutor?.length ?? 0) > 0 || (dadosGF?.length ?? 0) > 0;

    if (!hasDados) {
        return "";
    }

    let gfTables = "";
    if (dadosGF?.length) {
        gfTables = dadosGF
            .map((member, index) =>
                renderTable([member], `${tituloGF} - Membro ${index + 1}`, colunas)
            )
            .join("");
    }

    return `
        <p>
            <strong><span>${titulo}</span></strong>:
            ${mensagem}
        </p>
        ${dadosAutor?.length ? renderTable(dadosAutor, tituloAutor, colunas) : ""}
        ${gfTables}
    `;
};
