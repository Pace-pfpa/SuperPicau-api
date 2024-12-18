import { HtmlIImpeditivosRuralMaternidadeDTO } from "../CreateHtmlForRuralMaternidade/dtos/HtmlImpeditivosRMDTO";
import { IInfoUploadDTO, IResponseLabraAutorConjuge } from "../GetInformationFromSapiensForPicaPau/dto";
import { IObjInfoImpeditivosRural } from "../GetInformationFromSapiensForPicaPau/dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { brasaoLogo, estilos, renderConcessao, renderImoveisRurais, renderLitispendencia, renderPatrimonioImcompativel, renderRequerimento, renderSecao } from "./utils";
import { renderIdade } from "./utils/renderIdade";

export class ImpeditivosHtmlRural {
    async execute(
        data: HtmlIImpeditivosRuralMaternidadeDTO,
        infoUpload: IInfoUploadDTO,
        impedimentosDosprev: IObjInfoImpeditivosRural, 
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

        const tabelaTipo3 = await this.renderTabelaTipo3(data, impedimentosLabra, impedimentosDosprev);

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
                <p><br></p>
                <hr>
                <p style="color:rgb(0, 0, 0)" class="centralizado">
                <strong>CONTESTAÇÃO</strong>
                </p>
                <p>
                <strong>TIPO 3 - PROVA DOCUMENTAL DESCARACTERIZA PLEITO AUTORAL - DESNECESSIDADE DE AUDIÊNCIA DE INSTRUÇÃO E JULGAMENTO - JULGAMENTO ANTECIPADO DA LIDE.</strong>
                </p>
                <p>
                <strong>TIPO 4 - QUESTÕES PROCESSUAIS - EXTINÇÃO DO FEITO COM/SEM RESOLUÇÃO DO MÉRITO.</strong>
                </p>
                <hr>
                <p><br></p>
                <p>&nbsp;de acordo com as razões de fato e de direito que passa a aduzir.</p>
                <p><br></p>
                <hr>
                <h1><strong><span style="color:black">SÍNTESE FÁTICA</span></strong></h1>
                <p><br></p>
                <p>Trata-se de ação através da qual pretende a parte autora que seja a autarquia ré condenada ao pagamento do benefício previdenciário de aposentadoria por idade para segurado especial/aposentadoria por idade híbrida, sob alegação de ter preenchido todas as condições legais para tanto.</p>
                <p><br></p>
                <p>Em que pesem as alegações da parte autora, seu pleito não merece guarida, haja vista ser fruto de evidente equívoco. É o que passa o INSS a demonstrar.</p>
                <p><br></p>
                <hr>
                ${tabelaTipo4}
                ${tabelaTipo3}
                <h1><strong>DOS REQUERIMENTOS</strong></h1>
                <p><br></p>
                <p><br></p>
                <p><span style="color:black"><span><span>Ante o exposto, requer o&nbsp;</span></span></span><span><span>INSS, <span style="color:#242424">sem prejuízo do acolhimento das preliminares, sejam os pedidos julgados <strong>totalmente improcedentes, </strong>condenando a parte autora no pagamento das custas do processo e da verba honorária, com fulcro no art. 85, §§2º e 6º, do CPC, </span>sendo indevidos nas hipóteses da Lei 9.099/95.</span></span></p>
                <p><br></p>
                <p><span style="color:#242424"><span><span>Caso sejam julgados procedentes os pedidos da parte autora, a matéria de defesa fica desde já <strong>prequestionada</strong> para fins recursais.&nbsp;</span></span></span><span style="color:#242424"><span><span>Requer ainda</span></span></span><span style="color:#242424"><span><span>:</span></span></span></p>
                <ol><li><span><span>A observância da prescrição quinquenal;</span></span></li><li>Na hipótese de concessão&nbsp;de aposentadoria, a intimação da<span><span>&nbsp;parte autora para firmar e juntar aos autos a autodeclaração prevista no anexo XXIV da </span></span>Instrução Normativa PRES/INSS nº 128, de 28 de março de 2022<span><span>, em observância às regras de acumulação de benefícios estabelecida no art. 24, §§ 1.º e 2.º da Emenda Constitucional 103/2019;</span></span></li><li><span><span>Nas hipóteses da Lei n. 9.099/95</span></span><span><span>, caso inexista nos autos declaração com esse teor, a intimação da parte autora para renúncia&nbsp;expressa&nbsp;dos valores que excedam o teto de 60 (sessenta) salários mínimos na data da propositura da ação e que eventualmente venham a ser identificados ao longo do processo, inclusive em sede de execução;</span></span></li><li><span><span>A fixação dos honorários advocatícios nos termos da Súmula 111 do STJ, sendo indevidos nas hipóteses da Lei 9.099/95;</span></span></li><li><span><span>A declaração de isenção de custas e outras taxas judiciárias;</span></span></li><li><span><span>O desconto dos valores já pagos administrativamente ou de qualquer benefício inacumulável recebido no período e a&nbsp;cobrança&nbsp;de eventuais valores pagos em sede de antecipação dos efeitos da tutela posteriormente revogada;</span></span></li><li><span style="color:#242424"><span><span>A produção de todas as provas admitidas em direito;</span></span></span></li><li>Por cautela, para fins de atualização monetária, de remuneração do capital e de compensação da mora, que seja adotada a SELIC a partir de dezembro/2021, conforme a&nbsp;&nbsp;EC n. 113/2021.</li></ol>
                <p>Por fim, o&nbsp;INSS informa que não tem&nbsp;interesse na audiência de conciliação prevista no art. 334 do CPC e que concorda com o Juízo 100% digital, se for o caso.&nbsp;</p>
                <p><br></p>
                <p><span style="color:black"><span><span>Nesses termos, pede&nbsp;deferimento.</span></span></span></p>
                <p><br></p>
                <p><br></p>
                <p><br></p>
                <p class="data-hora">${currentDate}</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado username">${infoUpload.usuario.nome}</p>
                <p class="centralizado usarrole">${infoUpload.usuario.cargo}</p>
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
            console.log('NÃO RENDERIZOU NADA RURAL')
            return ""; // Não renderiza a tabela
        }

        const litispendenciaContent = renderLitispendencia(litispendencia, litispendenciaProcessos);
        const concessaoContent = renderConcessao(concessao);
        const requerimentoContent = renderRequerimento(requerimento);

        return `
            <h1><strong>PRELIMINARES</strong></h1>
            <p><br></p>
            <p><br></p>
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
                        Para provar a existência da(s) preliminar(es) acima, além de outras provas específicas identificadas na própria minuta, o INSS demonstra da         seguinte forma:
                        a) litispendência e coisa julgada (dossiê previdenciário e/ou processo judicial); 
                        b) prescrição quinquenal, concessão administrativa, ausência de requerimento administrativo, indeferimento forçado, requerimento pendente de        análise administrativa e ausência de cadúnico (dossiê previdenciário e/ou processo administrativo); 
                        c) ausência de início de prova material (análise da própria documentação juntada aos autos e/ou processo administrativo).
                        Por fim, o INSS pede a extinção do feito, nos termos do Art. 485 do CPC/2015. Em relação à prescrição, pede a extinção do feito, nos termos do      Art. 487 do CPC/2015.
                    </p>
                    <p><br></p>
                    </td>
                </tr>
                </tbody>
            </table>
            <p><br></p>
            <hr>
        `;
    }

    private async renderTabelaTipo3(data: HtmlIImpeditivosRuralMaternidadeDTO, impedimentosLabra: IResponseLabraAutorConjuge, impedimentosDosprev: IObjInfoImpeditivosRural): Promise<string> 
    {
        const { autor, conjuge } = impedimentosLabra;

        const idade = renderIdade(data.idade, impedimentosDosprev.idade);

        const atividadeEmpresarial = renderSecao(
            "ATIVIDADE EMPRESARIAL",
            `A parte autora, o(a) cônjuge ou companheiro(a) possui (ou possuiu) participação em sociedade empresária, sociedade simples, empresa individuaou empresa individual de responsabilidade limitada, em atividade 
            <u><strong>dentro do período de carência previsto em Lei</strong></u>, 
            <u><strong>em desacordo com as limitações legais</strong></u>, o que descaracteriza a qualidade de segurado especial (Lei 8.213/91, art. 11, VII, § 1º, §10, I, “d”, e §12).`,
            autor?.empresas,
            conjuge?.empresas,
            ["nomeVinculado", "cpfOuCnpj", "tipoDeVinculo", "dataEntrada"],
            "Empresas do Autor",
            "Empresas do Cônjuge"
        );

        const emprego = renderSecao(
            "EMPREGO",
            `A parte autora, seu (sua) cônjuge ou companheiro(a) possui(em) diversos vínculos privados/públicos anteriores ao nascimento, com percepção de salário incompatível com a agricultura de subsistência, o que descaracteriza a qualidade de segurado especial da parte autora.`,
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
        );

        const patrimonioIncompativel = renderPatrimonioImcompativel(autor, conjuge);

        const imovelRural = renderImoveisRurais(autor, conjuge);

        if (
            !atividadeEmpresarial &&
            !emprego &&
            !empregoDosprev &&
            !patrimonioIncompativel &&
            !imovelRural &&
            !idade
        ) {
            return "";
        }

        return `
        <h1><strong>DO MÉRITO</strong></h1>
        <p><br></p>
        <p class="centralizado"><strong>DO CASO CONCRETO </strong></p>
        <p><br></p>
        <p>No presente caso, restou demonstrado que:</p>
        <p><br></p>
        <table border="1" cellpadding="1" cellspacing="1" style="height:48px; width:786px">
            <tbody>
            <tr>
              <td style="background-color: rgb(204, 204, 204);">
                <p class="centralizado"><strong>PROVA DOCUMENTAL DESCARACTERIZA PLEITO AUTORAL - DESNECESSIDADE DE AUDIÊNCIA DE INSTRUÇÃO E JULGAMENTO - JULGAMENTO ANTECIPADO DA LIDE (TIPO 3)</strong></p>
              </td>
            </tr>
            <tr>
              <td>
                ${idade}
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
                  a) atividade empresarial (dados cadastrais e documentais); b) emprego (registros formais); c) patrimônio incompatível (informações financeiras); d) imóvel rural (cadastro de imóveis).
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <p><br></p>
        <p>Ante ao exposto, requer a improcedência do pedido.</p>
        <p><br></p>
        <hr>
        `;
    }
}