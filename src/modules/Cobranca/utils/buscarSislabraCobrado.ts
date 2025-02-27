const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { verificarGeracaoComponentes } from "../../GetInformationFromSapiensForPicaPau/utils/verificarGeracaoComponentes";

/**
 * Função auxiliar para buscar o sislabra do requerido do processo, para processos de cobrança.
 * A função filtra o sislabra do requerido (PÓLO PASSIVO), a partir de um array de documentos SAPIENS, e o formata.
 * @param arrayDeDocumentos Array de documentos SAPIENS.
 * @param cookie Cookie de usuário para interações com o SAPIENS.
 * @returns O sislabra do requerido (JSDOM).
 */
export async function buscarSislabraCobrado(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    cookie: string
): Promise<{ sislabraCobrado: JSDOMType }> {
    let sislabraCobrado: ResponseArvoreDeDocumentoDTO = null;
    let sislabraCobradoFormatado: JSDOMType = null;

    const documentosRequerido = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO PASSIVO") !== -1);
    
    for (const documento of documentosRequerido) {
        const isErroComponente = await verificarGeracaoComponentes(documento, cookie)
        if (isErroComponente instanceof Error) continue;
        sislabraCobrado = documento;
    }

    try {
        const idSislabraCobrado = sislabraCobrado.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraCobrado = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraCobrado });
        const paginaFormatadaCobrado = new JSDOM(paginaSislabraCobrado);
        
        sislabraCobradoFormatado = paginaFormatadaCobrado;
    } catch (error) {
        console.error(error.message);
        return { sislabraCobrado: null }
    }

    return { sislabraCobrado: sislabraCobradoFormatado }
}
