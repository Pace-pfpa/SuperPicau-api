import { HtmlIImpeditivosRuralMaternidadeDTO } from "../CreateHtmlForRuralMaternidade/dtos/HtmlImpeditivosRMDTO";
import { IInfoUploadDTO, IObjInfoImpeditivosMaternidade, IResponseLabraAutorConjuge } from "../GetInformationFromSapiensForPicaPau/dto";
import { brasaoLogo, 
        estilos, 
        renderSecao, 
        renderImoveisRurais, 
        renderLitispendencia, 
        renderPatrimonioImcompativel,
        renderConcessao, 
        renderRequerimento } from "./utils";

export class ImpeditivosHtmlMaternidade {
    async execute(
        data: HtmlIImpeditivosRuralMaternidadeDTO,
        infoUpload: IInfoUploadDTO,
        impedimentosDosprev: IObjInfoImpeditivosMaternidade, 
        impedimentosLabra: IResponseLabraAutorConjuge
    ): Promise<string> {
        const currentDate = new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const tabelaTipo4 = await this.renderTabelaTipo4(
            data.litispendencia,
            data.concessaoAnterior,
            data.requerimento,
            impedimentosDosprev.litispendencia
        );

        const tabelaTipo3 = await this.renderTabelaTipo3(impedimentosLabra, impedimentosDosprev);

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Relatório de Impeditivos</title>
                ${estilos()}
            </head>
            <body>
                <div class="centralizado">
                    ${brasaoLogo()}
                    <br>
                    ADVOCACIA GERAL DA UNIÃO
                    <br>
                    PROCURADORIA-GERAL FEDERAL
                    <br>
                    <span>${infoUpload.usuario.unidade}</span>
                    <br>
                    <span>${infoUpload.usuario.setor}</span>
                    <br>
                    <span style="font-size:7pt">${infoUpload.usuario.endereco}</span>
                </div>
                <hr>
                <p><br></p>
                <p class="esquerda">EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DO(A) ${infoUpload.infoMinuta.vara}</p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p class="esquerda"><strong>NÚMERO:</strong> ${infoUpload.numeroProcesso}</p>
                <p class="esquerda"><strong>REQUERENTE(S):</strong> ${infoUpload.infoMinuta.infoRequerente.nome}</p>
                <p class="esquerda"><strong>REQUERIDO(S):</strong> ${infoUpload.infoMinuta.infoRequerente.nome_requerido}</p>
                <p><br></p>
                <p><strong>INSTITUTO NACIONAL DO SEGURO SOCIAL - INSS</strong>, pessoa jurídica de direito público, representado(a) pelo membro da Advocacia-Geral da União infra assinado(a), vem, respeitosamente, à presença de Vossa Excelência, apresentar</p>
                <p><br></p>
                <p class="centralizado"><strong>CONTESTAÇÃO</strong></p>
                <p><br></p>
                ${tabelaTipo4}
                ${tabelaTipo3}
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <table border="1" cellpadding="1" cellspacing="1" style="height:23px; width:793px">
                <tbody>
                <tr>
                <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>FUNDAMENTOS JURÍDICOS</strong></td>
                </tr>
                <tr>
                <td><p>Para a concessão de benefício previdenciário ao trabalhador rural (salário-maternidade de segurada especial), no valor de um salário mínimo, exige-se a comprovação do exercício de trabalho rural, ainda que forma descontínua, <strong><u>mas no período imediatamente anterior ao fato gerador do benefício</u></strong>. No caso concreto, não houve a demonstração dos requisitos necessários à concessão do benefício. Considerando os motivos acima elencados, o pedido formulado deve ser julgado improcedente.</p></td>
                </tr>
                </tbody>
                </table>
                <p><br></p>
                <table border="1" cellpadding="1" cellspacing="1" style="height:46px; width:789px"><tbody><tr><td style="background-color: rgb(204, 204, 204);" class="centralizado">
                <strong>PREQUESTIONAMENTO</strong></td></tr><tr><td><p>Ficam prequestionados&nbsp;os art. 11,&nbsp;VII, §1º&nbsp;;&nbsp; 25, III, 39, p.u;&nbsp;71, 71-A , § 1º, 2º, 3º;&nbsp;<span style="display:inline !important"><span style="background-color:#ffffff"><span style="color:#000000">71-C</span></span></span>&nbsp;; 72, § 1º, 2º, 3º; 73, I, II, III;&nbsp; e art. 201, II da CF.</p></td></tr></tbody>
                </table>
                <p><br></p>
                <table border="1" cellpadding="1" cellspacing="1" style="height:45px; width:788px">
                  <tbody>
                    <tr><td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>DOS PEDIDOS</strong></td></tr><tr><td><p><br></p><p><span style="color:black">Ante o exposto, requer o&nbsp;</span>INSS o acolhimento das preliminares eventualmente levantadas. No mérito, requer que os <span style="color:#242424">pedidos julgados <strong>totalmente improcedentes, </strong>condenando a parte autora no pagamento das custas do processo e da verba honorária, com fulcro no art. 85, §§2º e 6º, do CPC, </span>sendo indevidos nas hipóteses da Lei 9.099/95, bem como que seja deferida a <span style="color:#242424">produção de todas as provas admitidas em direito</span></p><p><br></p><p><span style="color:#242424">Caso sejam julgados procedentes os pedidos da parte autora, &nbsp;o INSS <u><strong>requer</strong></u>: a) a</span> observância da prescrição quinquenal; b) a intimação da&nbsp;parte autora para firmar e juntar aos autos a autodeclaração prevista no anexo XXIV da Instrução Normativa PRES/INSS nº 128, de 28 de março de 2022, em observância às regras de acumulação de benefícios estabelecida no art. 24, §§ 1.º e 2.º da Emenda Constitucional 103/2019; c) nas hipóteses da Lei n. 9.099/95, caso inexista nos autos declaração com esse teor, a intimação da parte autora para renúncia&nbsp;expressa&nbsp;dos valores que excedam o teto de 60 (sessenta) salários mínimos na data da propositura da ação e que eventualmente venham a ser identificados ao longo do processo, inclusive em sede de execução; d) a fixação dos honorários advocatícios nos termos da Súmula 111 do STJ, sendo indevidos nas hipóteses da Lei 9.099/95; e) a declaração de isenção de custas e outras taxas judiciárias; f) o desconto dos valores já pagos administrativamente ou de qualquer benefício inacumulável recebido no período e a&nbsp;cobrança&nbsp;de eventuais valores pagos em sede de antecipação dos efeitos da tutela posteriormente revogada; g) a atualização monetária, de remuneração do capital e de compensação da mora, que seja adotada a SELIC a partir de dezembro/2021, conforme a&nbsp;&nbsp;EC n. 113/2021; h) o prequestionamento de todas as matérias de defesa para fins recursais.</p></td></tr>
                  </tbody>
                </table>
                <p><br></p>
                <p>Nesses termos, pede deferimento.</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="data-hora">${currentDate}</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado username">PROCURADORIA FEDERAL</p>
                <p class="centralizado usarrole">EQUIPE DE SEGURADOS ESPECIAIS E ASSISTÊNCIA SOCIAL DA 1ª REGIÃO</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
            </body>
            </html>
        `;

        return html;

    }

    private async renderTabelaTipo4(litispendencia: boolean, concessao: boolean, requerimento: boolean, litispendenciaProcessos: string[] | null): Promise<string> {
        if (!litispendencia && !concessao && !requerimento) {
          console.log('NÃO RENDERIZOU NADA')
            return ""; // Não renderiza a tabela
        }

      const litispendenciaContent = renderLitispendencia(litispendencia, litispendenciaProcessos);
      const concessaoContent = renderConcessao(concessao);
      const requerimentoContent = renderRequerimento(requerimento);

      return `
      <table border="1" cellpadding="1" cellspacing="1" style="height:20px; width:786px">
        <tbody>
          <tr>
            <td style="background-color: rgb(204, 204, 204);">
              <p class="centralizado"><strong>TIPO 4 - QUESTÕES PROCESSUAIS - EXTINÇÃO DO FEITO COM/SEM RESOLUÇÃO DO MÉRITO</strong></p>
            </td>
          </tr>
          <tr>
            <td>
              <p><br></p>
              <p>O INSS aduz a(s) seguinte(s) preliminar(es):</p>
              ${litispendenciaContent}
              ${concessaoContent}
              ${requerimentoContent}
            </td>
          </tr>
          <tr>
            <td style="background-color: rgb(204, 204, 204);" class="centralizado">
              <strong>INDICAÇÃO DAS PROVAS E REQUERIMENTOS PRELIMINARES</strong>
            </td>
          </tr>
          <tr>
            <td class="centralizado">
              <p><br></p>
              <p>
                Para provar a existência da(s) preliminar(es) acima, além de outras provas específicas identificadas na própria minuta, o INSS demonstra da seguinte forma:
                a) litispendência e coisa julgada (dossiê previdenciário e/ou processo judicial); 
                b) prescrição quinquenal, concessão administrativa, ausência de requerimento administrativo, indeferimento forçado, requerimento pendente de análise administrativa e ausência de cadúnico (dossiê previdenciário e/ou processo administrativo); 
                c) ausência de início de prova material (análise da própria documentação juntada aos autos e/ou processo administrativo).
                Por fim, o INSS pede a extinção do feito, nos termos do Art. 485 do CPC/2015. Em relação à prescrição, pede a extinção do feito, nos termos do Art. 487 do CPC/2015.
              </p>
              <p><br></p>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="centralizado"><br></p>
      <hr>
    `;
    }

    private async renderTabelaTipo3(impedimentosLabra: IResponseLabraAutorConjuge, impedimentosDosprev: IObjInfoImpeditivosMaternidade): Promise<string> 
    {
        const { autor, conjuge } = impedimentosLabra;

        const atividadeEmpresarial = renderSecao(
          "ATIVIDADE EMPRESARIAL",
          `A parte autora, o(a) cônjuge ou companheiro(a) possui (ou possuiu) participação em sociedade empresária, sociedade simples, empresa individual ou empresa individual de responsabilidade limitada, em atividade 
          <u><strong>dentro do período de carência previsto em Lei</strong></u>, 
          <u><strong>em desacordo com as limitações legais</strong></u>, o que descaracteriza a qualidade de segurado especial.`,
          autor?.empresas,
          conjuge?.empresas,
          ["nomeVinculado", "cpfOuCnpj", "tipoDeVinculo", "dataEntrada"],
          "Empresas do Autor",
          "Empresas do Cônjuge"
        );
        
        const emprego = renderSecao(
          "EMPREGO",
          `O(a) cônjuge ou companheiro(a) possui diversos vínculos privados/públicos anteriores ao nascimento, com percepção de salário incompatível com a agricultura de subsistência, o que descaracteriza a qualidade de segurado especial da parte autora.`,
          autor?.empregos,
          conjuge?.empregos,
          ["salarioContrato", "ocupacao", "empresa"],
          "Empregos do Autor",
          "Empregos do Cônjuge"
        );

        const empregoDosprev = renderSecao(
          "EMPREGO AUTOR",
          `A parte autora possui diversos vínculos privados/públicos no período de carência, em total desacordo com os limites estabelecidos pela Lei e pela jurisprudência pacífica, conforme informações no dossiê previdenciário anexado.`,
          impedimentosDosprev?.emprego,
          null,
          ["vinculo", "dataInicio", "dataFim", "filiacao", "ocupacao"],
          "Empregos do Autor (Dossiê)",
          "SEM INFORMAÇÕES"
        )


        const patrimonioIncompativel = renderPatrimonioImcompativel(autor, conjuge);

        const imovelRural = renderImoveisRurais(autor, conjuge);
        
        if (
            !atividadeEmpresarial &&
            !emprego &&
            !empregoDosprev &&
            !patrimonioIncompativel &&
            !imovelRural
        ) {
            return "";
        }


        return `
        <p class="centralizado"><br></p>
        <table border="1" cellpadding="1" cellspacing="1" style="height:48px; width:786px">
          <tbody>
            <tr>
              <td style="background-color: rgb(204, 204, 204);">
                <p class="centralizado"><strong>PROVA DOCUMENTAL DESCARACTERIZA PLEITO AUTORAL - DESNECESSIDADE DE AUDIÊNCIA DE INSTRUÇÃO E JULGAMENTO - JULGAMENTO ANTECIPADO DA LIDE (TIPO 3)</strong></p>
              </td>
            </tr>
            <tr>
              <td>
                ${atividadeEmpresarial}
                ${emprego}
                ${empregoDosprev}
                ${patrimonioIncompativel}
                ${imovelRural}
              </td>
            </tr>
            <tr>
              <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>PROVAS</strong></td>
            </tr>
            <tr>
              <td>
                <p>
                  Para provar a existência da preliminar acima, além de outras provas específicas identificadas na própria minuta, o INSS demonstra da seguinte forma:
                  a) atividade empresarial (informações da atividade empresarial na minuta de contestação); b) emprego (juntada de dossiê previdenciário e/ou informações na minuta de contestação); c) patrimônio incompatível (informações na minuta de contestação); d) imóvel rural (informações na minuta de contestação).
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
}