import { renderTable, verificarSeTodosSaoVazios } from "..";
import { IImpedimentosLoas } from "../../../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/IImpedimentosLoas";

export const renderSecaoLoas = (
    titulo: string,
    mensagem: string,
    dadosAutor: any[] | undefined,
    grupoFamiliar: IImpedimentosLoas[],
    colunas: string[],
    tituloAutor: string,
    tituloGF: string
): string => {
    const valoresParaVerificar = [
        ...grupoFamiliar.map((membro) => membro.empresas),
    ];

    const hasDados = (dadosAutor?.length ?? 0) > 0 || !verificarSeTodosSaoVazios(valoresParaVerificar);

    if (!hasDados) {
        return "";
    }

    const empresasFamilia = grupoFamiliar
        .map((membro, index) =>
          membro.empresas.length
            ? renderTable(
                membro.empresas,
                tituloGF,
                colunas
              ) : ''
        )
        .join("");

    return `
        <p>
            <strong><span>${titulo}</span></strong>:
            ${mensagem}
        </p>
        ${dadosAutor?.length ? renderTable(dadosAutor, tituloAutor, colunas) : ""}
        ${empresasFamilia}
    `;
};
