const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { verificarGeracaoComponentes } from "../../GetInformationFromSapiensForPicaPau/utils/verificarGeracaoComponentes";

/**
 * Função auxiliar para buscar os sislabras dos requeridos do processo, para processos de cobrança.
 * A função filtra os sislabras dos requeridos (PÓLO PASSIVO), a partir de um array de documentos SAPIENS, e os formata.
 * @param arrayDeDocumentos Array de documentos SAPIENS.
 * @param cookie Cookie de usuário para interações com o SAPIENS.
 * @returns Os sislabra do requerido (JSDOM) ou array vazio.
 */
export async function buscarSislabraCobrado(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    cookie: string
): Promise<{ sislabraCobrado: JSDOMType[] }> {
    let sislabraCobrado: ResponseArvoreDeDocumentoDTO[] = [];
    let sislabraCobradoFormatado: JSDOMType[] = [];

    const documentosRequerido = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO PASSIVO") !== -1);
    
    for (const documento of documentosRequerido) {
        const isErroComponente = await verificarGeracaoComponentes(documento, cookie)
        if (isErroComponente instanceof Error) continue;
        sislabraCobrado.push(documento);
    }

    for (const sislabra of sislabraCobrado) {
        try {
            const idSislabraCobrado = sislabra.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabraCobrado = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraCobrado });
            const paginaFormatadaCobrado = new JSDOM(paginaSislabraCobrado);
            
            sislabraCobradoFormatado.push(paginaFormatadaCobrado);
        } catch (error) {
            console.error(error.message);
            continue
        }
    }

    return { sislabraCobrado: sislabraCobradoFormatado }
}
