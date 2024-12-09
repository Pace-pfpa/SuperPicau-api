import { HtmlIImpeditivosRuralMaternidadeDTO } from "../CreateHtmlForRuralMaternidade/dtos/HtmlImpeditivosRMDTO";
import { IInfoUploadDTO, IObjInfoImpeditivosRM, IResponseLabraAutorConjuge } from "../GetInformationFromSapiensForPicaPau/dto";
import { brasaoLogo, 
        estilos, 
        renderSecao, 
        renderImoveisRurais, 
        renderLitispendencia, 
        renderPatrimonioImcompativel,
        renderConcessao, 
        renderRequerimento} from "./utils";

export class ImpeditivosHtmlMaternidade {
    async execute(
        data: HtmlIImpeditivosRuralMaternidadeDTO,
        infoUpload: IInfoUploadDTO,
        impedimentosDosprev: IObjInfoImpeditivosRM, 
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

        const tabelaTipo3 = await this.renderTabelaTipo3(impedimentosLabra);

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
                    <span>${infoUpload.usuario_unidade}</span>
                    <br>
                    <span>${infoUpload.usuario_setor_nome}</span>
                    <br>
                    <span style="font-size:7pt">${infoUpload.usuario_setor_endereco}</span>
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
                <p><br></p>
                <table border="1" cellpadding="1" cellspacing="1" style="height:64px; width:790px">
                    <tbody>
                        <tr>
                            <td style="background-color: rgb(204, 204, 204);">
                                <p class="centralizado"><strong><span style="color:black">TIPO 1: PROPOSTA DE ACORDO</span></strong></p>
                                <p class="centralizado"><strong>(DA AUSÊNCIA DE INTERESSE DO ENTE PÚBLICO&nbsp;EM CONTRAPROPOSTA EVENTUALMENTE FORMULADA PELA PARTE AUTORA)</strong></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p><br></p>
                <p>1. O INSS se compromete a conceder/manter ativo o benefício postulado à parte autora, nos seguintes moldes:</p>
                <p><br></p>
                <table align="center" border="1" cellpadding="1" cellspacing="1" style="height:500px; width:800px">
                    <tbody>
                        <tr>
                            <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>BENEFÍCIO</strong></td><td colspan="3" style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>SALÁRIO-MATERNIDADE - SEGURADO&nbsp;ESPECIAL</strong></td>
                        </tr>
                        <tr>
                            <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>NOME DA PARTE AUTORA / CPF</strong></td>
                            <td colspan="3">${infoUpload.infoMinuta.infoRequerente.nome} (${infoUpload.infoMinuta.infoRequerente.cpf})</td>
                        </tr>
                        <tr>
                            <td style="background-color: rgb(204, 204, 204);"><p class="centralizado"><strong>DIB</strong></p><p class="centralizado"><strong>(data de início do benefício)</strong></p></td><td colspan="3" class="centralizado"><strong>DATA DO NASCIMENTO DA CRIANÇA</strong></td>
                        </tr>
                        <tr>
                            <td rowspan="3" style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>COMPOSIÇÃO DOS VALORES ATRASADOS</strong></td><td style="background-color: rgb(204, 204, 204);"><p class="centralizado"><strong>EXERCÍCIOS ANTERIORES</strong></p><p class="centralizado"><strong>(A)</strong></p></td><td style="background-color: rgb(204, 204, 204);"><p class="centralizado"><strong>EXERCÍCIO</strong></p><p class="centralizado"><strong>ATUAL</strong></p><p class="centralizado"><strong>(B)</strong></p></td><td style="background-color: rgb(204, 204, 204);"><p class="centralizado"><strong>TOTAL DE ATRASADOS DEVIDOS</strong></p><p class="centralizado"><strong>(A+B)</strong></p></td>
                        </tr>
                        <tr>
                            <td class="centralizado"><strong>R$ 5.500,00</strong></td>
                            <td class="centralizado"><strong>----------</strong></td>
                            <td class="centralizado"><strong>R$ 5.500,00</strong></td>
                        </tr>
                        <tr>
                            <td class="centralizado"><strong><span style="color:black">04 </span></strong>PARCELAS</td>
                            <td class="centralizado"><strong>----------</strong></td>
                            <td class="centralizado"><strong>----------</strong></td>
                        </tr>
                        <tr>
                            <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>ATRASADOS</strong></td>
                            <td colspan="3">O valor total do acordo acima indicado, corresponde aproximadamente a 100% dos valores devidos, sem a inclusão de 13º salário proporcional, a serem pagos por meio de RPV (requisição de pequeno valor), abatidas as parcelas de benefícios inacumuláveis recebidos no interregno.</td>
                        </tr>
                        <tr>
                            <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>HONORÁRIOS ADVOCATÍCIOS</strong></td>
                            <td colspan="3">&nbsp;Não haverá pagamento de honorários advocatícios nos casos em trâmite&nbsp;perante o Juizado Especial Federal; tratando-se de ação ordinária, propõe-se o pagamento de <u><strong>10%</strong></u> sobre o valor do acordo.&nbsp;</td>
                        </tr>
                        </tbody>
                </table>
                <p><br></p>
                <p>
                    *A presente proposta de acordo somente será válida caso todos os parâmetros necessários para a implantação, revisão ou reativação do benefício em questão sejam devidamente preenchidos pelas partes. Na hipótese de ausência de qualquer parâmetro, ainda que haja manifestação favorável da parte contrária, o INSS deverá ser intimado para corrigir a petição incompleta, sob pena de sua nulidade.
                </p>
                <p><br></p>
                <p><br></p>
                <p class="centralizado"><strong>PROCURADORIA FEDERAL</strong></p>
                <p class="centralizado"><strong>EQUIPE DE SEGURADOS ESPECIAIS E ASSISTÊNCIA SOCIAL DA 1ª REGIÃO</strong></p>
                <p class="centralizado"><br></p>
                ${tabelaTipo4}
                <p class="centralizado"><br></p>
                <hr>
                <p class="centralizado"><br></p>
                ${tabelaTipo3}
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="data-hora">${currentDate}</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado username">${infoUpload.usuario_nome}</p>
                <p class="centralizado usarrole">${infoUpload.usuario_cargo}</p>
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
    `;
    }

    private async renderTabelaTipo3(impedimentosLabra: IResponseLabraAutorConjuge): Promise<string> {
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


        const patrimonioIncompativel = renderPatrimonioImcompativel(autor, conjuge);

        const imovelRural = renderImoveisRurais(autor, conjuge);
        
        if (
            !atividadeEmpresarial &&
            !emprego &&
            !patrimonioIncompativel &&
            !imovelRural
        ) {
            return "";
        }


        return `
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
                  a) atividade empresarial (dados cadastrais e documentais); b) emprego (registros formais); c) patrimônio incompatível (informações financeiras); d) imóvel rural (cadastro de imóveis).
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
}