import axios from "axios";

export async function atualizarHtmlEditor(
    cookie: string,
    documentoId: number,
    componenteDigitalId: number,
    ticket: string,
    conteudoHTML: string
): Promise<void> {
    const baseUrl = `https://sapiens.agu.gov.br`;
    const resource = `${baseUrl}/upload_editor`;
    const referer = `${baseUrl}/editor?d=${documentoId}&c=${componenteDigitalId}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Referer: referer,
        Cookie: cookie,
    };

    const postData = {
        autoSave: false,
        documento: documentoId,
        componenteDigital: componenteDigitalId,
        ticket,
        conteudoHTML,
    };

    try {
        const response = await axios.post(resource, postData, { headers });
        if (response.status !== 200) {
            throw new Error("Falha ao atualizar o documento.");
        }
        console.log("Documento atualizado com sucesso.");
    } catch (error) {
        console.error("Erro ao atualizar o documento:", error.message);
        throw new Error("Falha ao atualizar o documento. Verifique os parâmetros e tente novamente.");
    }
}
