import axios from "axios";

export async function obterHtmlETicketEditor(
    cookie: string,
    documentoId: number,
    componenteDigitalId: number
): Promise<{ html: string; ticket: string }> {
    const baseUrl = `https://sapiens.agu.gov.br`;
    const resource = `${baseUrl}/documento/${componenteDigitalId}/1?_dc=${Date.now()}`;
    const referer = `${baseUrl}/editor?d=${documentoId}&c=${componenteDigitalId}`;
    const headers = {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",
        Referer: referer,
        Cookie: cookie,
    };

    try {
        const response = await axios.get(resource, { headers });
        if (response.status !== 200 || !response.data) {
            throw new Error("Falha ao obter o HTML e o ticket de edição.");
        }
        
        const html = response.data.conteudo;
        const ticket = response.data.ticket;

        return { html, ticket };
    } catch (error) {
        console.error("Erro ao obter o HTML e o ticket de edição:", error.message);
        throw new Error("Falha ao obter o HTML e o ticket de edição. Verifique os parâmetros e tente novamente.");
    }
}
