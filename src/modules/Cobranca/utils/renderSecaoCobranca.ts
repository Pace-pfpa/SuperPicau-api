import { renderTable } from "../../CreateHtmlForRM/utils";
import { CobrancaLabras } from "../types/CobrancaLabras.types";

export const renderSecaoCobranca = (
    encontrado: boolean,
    titulo: string,
    dados: CobrancaLabras[],
    colunas: string[]
): string => {
    if (!encontrado) return "";

    const empresasEncontradas = dados
        .map((membro, _index) =>
          membro.impeditivos.empresas.length
            ? renderTable(
                membro.impeditivos.empresas,
                'Empresas da Parte' + ` - ${membro.nome}`,
                colunas
              ) : ''
        )
        .join("");

    return `
        <p>
            <strong><span>${titulo}</span></strong>:
        </p>
        ${empresasEncontradas}
    `;
}