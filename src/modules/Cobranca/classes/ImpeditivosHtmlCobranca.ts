import { brasaoLogo, estilos } from "../../CreateHtmlForRM/utils";
import { ICobrancaExtracted } from "../interfaces/ICobrancaExtracted";
import { CobrancaLabras } from "../types/CobrancaLabras.types";
import { HtmlImpeditivosCobrancaType } from "../types/HtmlImpeditivosCobranca.type";
import { InfoCapa } from "../types/InfoCapa.type";
import { renderPatrimonioCobranca } from "../utils/renderPatrimonioCobranca";
import { renderSecaoCobranca } from "../utils/renderSecaoCobranca";

export default class ImpeditivosHtmlCobranca {
  async execute(
        data: HtmlImpeditivosCobrancaType,
        impedimentosCobranca: ICobrancaExtracted,
        infoCapa: InfoCapa,
        impeditivosLabra: CobrancaLabras[]
    ): Promise<string> {
        const currentDate = new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const tabela = await this.renderTabela(
            data,
            impeditivosLabra,
            infoCapa,
        );

        const partes = this.renderPartes(impedimentosCobranca.infoUpload.numeroProcesso, infoCapa);

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${estilos()}
            </head>
            <body>
                <div style="text-align: center;">
                    ${brasaoLogo()}
                    <br>
                    <span style="text-indent: 0;">ADVOCACIA GERAL DA UNIÃO</span>
                    <br>
                    <span style="center; text-indent: 0;">PROCURADORIA-GERAL FEDERAL</span>
                    <br>
                    <span style="text-indent: 0;">${impedimentosCobranca.infoUpload.usuario.unidade}</span>
                    <br>
                    <span style="text-indent: 0;">${impedimentosCobranca.infoUpload.usuario.setor}</span>
                    <br>
                    <span style="font-size:7pt; text-indent: 0">${impedimentosCobranca.infoUpload.usuario.endereco}</span>
                </div>
                <hr>
                <p><br></p>
                <p class="esquerda">EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO(A) ${impedimentosCobranca.infoUpload.infoMinuta.vara}</p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                ${partes}
                <p><strong>${infoCapa.poloAtivo.nome}</strong>, pessoa jurídica de direito público, representado(a) pelo membro da Advocacia-Geral da União infra-assinado(a), vem, respeitosamente, à presença de Vossa Excelência, requerer o que segue</p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p>A entidade credora requer a expedição de mandado de penhora de bens do devedor, tanto quanto bastem para a garantia da execução, a ser cumprido no endereço do devedor.</p>
                ${tabela}
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="data-hora">${currentDate}</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado username">PROCURADORIA FEDERAL</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
            </body>
            </html>
        `;

        return html;

  }

  private async renderTabela(
        objetoBooleano: HtmlImpeditivosCobrancaType,
        impedimentosLabra: CobrancaLabras[],
        infoCapa: InfoCapa
    ): Promise<string> {

        const atividadeEmpresarial = renderSecaoCobranca(
          objetoBooleano.empresa,
          "PENHORA DE COTA DA EMPRESA",
          impedimentosLabra,
          ["nomeVinculado", "cpfOuCnpj", "tipoDeVinculo", "dataEntrada"]
        );


        const patrimonioIncompativel = renderPatrimonioCobranca(objetoBooleano, impedimentosLabra);
        
        if (
            !atividadeEmpresarial &&
            !patrimonioIncompativel
        ) {
            return "";
        }


        return `
        <p class="centralizado"><br></p>
        <table border="1" cellpadding="1" cellspacing="1" style="border-collapse:collapse; border:medium; height:340px; width:826px">
          <tbody>
            <tr>
              <td style="width:623px;">
                <p class="centralizado"><strong>SOLICITAÇÃO DE PENHORA</strong></p>
              </td>
            </tr>
            <tr>
              <td style="width:623px;">
                <p>
                  <strong><span>VALOR DA CAUSA</span></strong>: ${infoCapa.valorCausa}
                </p>
                ${atividadeEmpresarial}
                ${patrimonioIncompativel}
              </td> 
            </tr>
          </tbody>
        </table>
      `;
  }

  private renderPartes(numeroProcesso: string, infoCapa: InfoCapa): string {
    if (infoCapa.poloPassivo.length === 1) {
      return `
        <p><br></p>
        <p class="esquerda"><strong>NÚMERO: ${numeroProcesso}</strong></p>
        <p class="esquerda"><strong>PARTE(S): ${infoCapa.poloAtivo.nome}</strong></p>
        <p class="esquerda"><strong>PARTE(S): ${infoCapa.poloPassivo[0].nome}</strong></p>
        <p><br></p>
      `
    }

    let partesString: string = '';

    for (const parte of infoCapa.poloPassivo) {
      partesString += `
        <p class="esquerda"><strong>PARTE(S): ${parte.nome}</strong></p>
      `
    }

    return `
      <p><br></p>
        <p class="esquerda"><strong>NÚMERO: ${numeroProcesso}</strong></p>
        <p class="esquerda"><strong>PARTE(S): ${infoCapa.poloAtivo.nome}</strong></p>
        ${partesString}
        <p><br></p>
    `
  }
}