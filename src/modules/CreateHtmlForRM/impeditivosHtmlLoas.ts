import { IInfoUploadDTO, IObjInfoImpeditivosLoas } from "../GetInformationFromSapiensForPicaPau/dto";
import { IResponseLabraAutorGF } from "../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/IResponseLabraAutorGF";
import { HtmlIImpeditivosLoasDTO } from "./dto/HtmlImpeditivosLoasDTO";
import { renderLitispendencia, renderRequerimento, renderConcessaoLoas, estilos, brasaoLogo } from "./utils";
import { renderBeneficioAtivo } from "./utils/renders/renderBeneficioAtivo";
import { renderIdadeLoas } from "./utils/renders/renderIdadeLoas";
import { renderPatrimonioImcompativelLoas } from "./utils/renders/renderPatrimonioIncompativelLoas";
import { renderRendaFamiliar } from "./utils/renders/renderRendaFamiliar";
import { renderSecaoLoas } from "./utils/renders/renderSecaoLoas";

export class ImpeditivosHtmlLoas {
    async execute(
            data: HtmlIImpeditivosLoasDTO,
            infoUpload: IInfoUploadDTO,
            impedimentosDosprev: IObjInfoImpeditivosLoas, 
            impedimentosLabra: IResponseLabraAutorGF
    ): Promise<string> {
        const currentDate = new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const tabelaTipo4 = await this.renderTabelaTipo4(
            data.litispendencia,
            data.bpc,
            data.requerimento,
            impedimentosDosprev.litispendencia,
            impedimentosDosprev.bpc
        );

        const segundaTabela = await this.renderSegundaTabela(data, impedimentosDosprev, impedimentosLabra);

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${estilos()}
            </head>
            <body>
                <div class="topo">
                    <div style="text-align: center !important;">
                        <p>${brasaoLogo()}</p>
                        <p>ADVOCACIA GERAL DA UNIÃO</p>
                        <p style="text-align: center !important;">PROCURADORIA-GERAL FEDERAL</p>
                        <p style="text-align: center !important;">${infoUpload.usuario.unidade}</p>
                        <p style="text-align: center !important;">${infoUpload.usuario.setor}</p>
                        <p style="font-size: 7pt;">${infoUpload.usuario.endereco}</p>
                    </div>
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
                <p class="esquerda"><strong>NÚMERO: ${infoUpload.numeroProcesso}</strong></p>
                <p class="esquerda"><strong>REQUERENTE(S): ${infoUpload.infoMinuta.infoRequerente.nome}</strong></p>
                <p class="esquerda"><strong>REQUERIDO(S): ${infoUpload.infoMinuta.infoRequerente.nome_requerido}</strong></p>
                <p><br></p>
                <p><strong>INSTITUTO NACIONAL DO SEGURO SOCIAL - INSS</strong>, pessoa jurídica de direito público, representado(a) pelo membro da Advocacia-Geral da União infra assinado(a), vem, respeitosamente, à presença de Vossa Excelência, apresentar</p>
                <p><br></p>
                <p class="centralizado"><strong>CONTESTAÇÃO</strong></p>
                <p><br></p>
                ${tabelaTipo4}
                ${segundaTabela}
                <p><br></p>
                <table border="1" cellpadding="1" cellspacing="1" style="height:23px; width:793px">
                    <tbody>
                        <tr><td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>FUNDAMENTOS JURÍDICOS</strong></td></tr><tr><td><p>A parte autora ingressou com a presente ação visando à condenação da Autarquia concessão ou o restabelecimento do benefício assistencial previsto na Lei nº 8.742/93. A pretensão não merece prosperar, conforme se passa a demonstrar. Considerando os motivos acima elencados, o pedido formulado deve ser julgado improcedente.</p></td>
                        </tr>
                    </tbody>
                </table>

                <p><br></p>
                <table border="1" cellpadding="1" cellspacing="1" style="height:46px; width:789px"><tbody><tr><td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>PREQUESTIONAMENTO</strong></td></tr><tr><td><p>Ficam prequestionados os artigos 20 e 20-B da Lei 8.742/93 e artigo 203, inciso V, da CRFB/88.</p></td></tr></tbody></table>
                <p><br></p>

                <table border="1" cellpadding="1" cellspacing="1" style="height:45px; width:788px"><tbody><tr><td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>DOS PEDIDOS</strong></td></tr><tr><td><p><br></p><p><span style="color:black">Ante o exposto, requer o&nbsp;</span>INSS o acolhimento das preliminares eventualmente levantadas. No mérito, requer que os <span style="color:#242424">pedidos julgados <strong>totalmente improcedentes, </strong>condenando a parte autora no pagamento das custas do processo e da verba honorária, com fulcro no art. 85, §§2º e 6º, do CPC, </span>sendo indevidos nas hipóteses da Lei 9.099/95, bem como que seja deferida a <span style="color:#242424">produção de todas as provas admitidas em direito</span></p><p><br></p><p><span style="color:#242424">Caso sejam julgados procedentes os pedidos da parte autora, &nbsp;o INSS <u><strong>requer</strong></u>: a) a</span> observância da prescrição quinquenal; b) a intimação da&nbsp;parte autora para firmar e juntar aos autos a autodeclaração prevista no anexo XXIV da Instrução Normativa PRES/INSS nº 128, de 28 de março de 2022, em observância às regras de acumulação de benefícios estabelecida no art. 24, §§ 1.º e 2.º da Emenda Constitucional 103/2019; c) nas hipóteses da Lei n. 9.099/95, caso inexista nos autos declaração com esse teor, a intimação da parte autora para renúncia&nbsp;expressa&nbsp;dos valores que excedam o teto de 60 (sessenta) salários mínimos na data da propositura da ação e que eventualmente venham a ser identificados ao longo do processo, inclusive em sede de execução; d) a fixação dos honorários advocatícios nos termos da Súmula 111 do STJ, sendo indevidos nas hipóteses da Lei 9.099/95; e) a declaração de isenção de custas e outras taxas judiciárias; f) o desconto dos valores já pagos administrativamente ou de qualquer benefício inacumulável recebido no período e a&nbsp;cobrança&nbsp;de eventuais valores pagos em sede de antecipação dos efeitos da tutela posteriormente revogada; g) a atualização monetária, de remuneração do capital e de compensação da mora, que seja adotada a SELIC a partir de dezembro/2021, conforme a&nbsp;&nbsp;EC n. 113/2021; h) o prequestionamento de todas as matérias de defesa para fins recursais.</p></td></tr></tbody></table>
                <p><br></p>

                <p><span style="color:black"><span><span>Nesses termos, pede&nbsp;deferimento.</span></span></span></p>
                <p><br></p>
                <p class="data-hora">${currentDate}</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
                <p class="centralizado username">PROCURADORIA FEDERAL</p>
                <p class="centralizado usarrole">EQUIPE DE SEGURADOS ESPECIAIS E ASSISTÊNCIA SOCIAL DA 1ª REGIÃO</p>
                <p class="centralizado"><br></p>
                <p class="centralizado"><br></p>
            </body>
            </html>
        `;

        return html;
    }

    private async renderTabelaTipo4(
        litispendencia: boolean,
        bpc: boolean,
        requerimento: boolean,
        litispendenciaProcessos: string[] | null,
        bpcEncontrado: string | null,
    ): Promise<string> {
        if (!litispendencia && !bpc && !requerimento) {
            console.log('NÃO RENDERIZOU NADA LOAS')
            return ""; // Não renderiza a tabela
        }

        const litispendenciaContent = renderLitispendencia(litispendencia, litispendenciaProcessos);
        const bpcContent = renderConcessaoLoas(bpc, bpcEncontrado);
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
                    ${bpcContent}
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
                        b) prescrição quinquenal, concessão administrativa, ausência de requerimento administrativo, indeferimento forçado, requerimento pendente de análise administrativa e ausência de cadúnico (dossiê previdenciário e/ou processo administrativo).
                        Por fim, o INSS pede a extinção do feito, nos termos do Art. 485 do CPC/2015. Em relação a prescrição, pede a extinção do feito, nos termos do Art. 487 do CPC/2015.
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

    private async renderSegundaTabela(
        data: HtmlIImpeditivosLoasDTO,
        impedimentosDosprev: IObjInfoImpeditivosLoas,
        impedimentosLabra: IResponseLabraAutorGF
    ): Promise<string> {
        const { autor, gf } = impedimentosLabra;

        const renda = renderRendaFamiliar(data.renda, impedimentosDosprev.renda);
        
        const atividadeEmpresarial = renderSecaoLoas(
            "ATIVIDADE EMPRESARIAL",
            `A parte autora ou algum integrante do grupo familiar possui participação em sociedade empresária, sociedade simples, empresa individual ou empresa individual de responsabilidade limitada, em atividade incompatível para a percepção do benefício assistencial.`,
            autor?.empresas,
            gf?.map((membro) => membro.empresas),
            ["nomeVinculado", "cpfOuCnpj", "tipoDeVinculo", "dataEntrada"],
            "Empresas do Autor",
            "Empresas do Grupo Familiar"
        );
        
        const patrimonioIncompativel = renderPatrimonioImcompativelLoas(autor, gf);

        const beneficioAtivo = renderBeneficioAtivo(data.beneficio, impedimentosDosprev.beneficio);
        
        const idade = renderIdadeLoas(data.idade, impedimentosDosprev.idade);

        if (
            !renda &&
            !atividadeEmpresarial &&
            !patrimonioIncompativel &&
            !beneficioAtivo &&
            !idade
        ) {
            return '';
        }

        return `
            <p><br></p>
            <table border="1" cellpadding="1" cellspacing="1" style="height:48px; width:786px">
            <tbody>
                <tr>
                  <td style="background-color: rgb(204, 204, 204);">
                    <p class="centralizado"><strong>TIPO 4 - IMPOSSIBILIDADE DE CONCESSÃO DE BENEFÍCIO ASSISTENCIAL - AUSÊNCIA DE REQUISITOS LEGAIS</strong></p>
                  </td>
                </tr>
            <tr>
                <td>
                    ${renda}
                    ${atividadeEmpresarial}
                    ${patrimonioIncompativel}
                    ${beneficioAtivo}
                    ${idade}
                </td>
            </tr>
            <tr>
                <td style="background-color: rgb(204, 204, 204);" class="centralizado"><strong>PROVAS</strong></td>
            </tr>
             <tr>
              <td>
                 <p>
                  Para provar a existência da preliminar acima, além de outras provas específicas identificadas na própria minuta, o INSS demonstra da seguinte forma: a) atividade empresarial (informações da atividade empresarial na minuta de contestação); b) renda incompatível (renda de todos os integrantes do grupo familiar na minuta de contestação); c) patrimônio incompatível (informações na minuta de contestação); d) benefício incompatível ativo (juntada de dossiê previdenciário e/ou informações na minuta de contestação); e) idade mínima (juntada de dossiê previdenciário e/ou informações na minuta de contestação); f) benefício ativo (juntada de dossiê previdenciário e/ou informações na minuta de contestação).
                    </p>
                </td>
            </tr>
           </tbody>
           </table>
           <p><br></p>
        `;
    }
}