import { IObjInfoImpeditivosMaternidade } from "../../../../GetInformationFromSapiensForPicaPau/dto";
import { HtmlIImpeditivosMaternidadeDTO } from "../../../dto/HtmlImpeditivosMaternidade";

export const renderConcessaoMaternidade = (
  impeditivosBooleans: HtmlIImpeditivosMaternidadeDTO,
  impeditivosDosprev: IObjInfoImpeditivosMaternidade
): string => {
    if (
      !impeditivosBooleans.concessaoAnterior &&
      !impeditivosBooleans.beneficioAtivo &&
      !impeditivosBooleans.beneficioIncompativel
    ) return "";

    let beneficiosContent = '';
    if (impeditivosBooleans.concessaoAnterior) {
      beneficiosContent = impeditivosDosprev.concessaoAnterior.length
      ? impeditivosDosprev.concessaoAnterior.map(beneficio => `<strong><span>${beneficio}</span></strong>`).join(", ")
      : "Sem informações de benefícios.";
    }
    
    if (impeditivosBooleans.beneficioAtivo) {
      beneficiosContent = impeditivosDosprev.beneficioAtivo.length
          ? impeditivosDosprev.beneficioAtivo.map(beneficio => `<strong><span>${beneficio}</span></strong>`).join(", ")
          : "Sem informações de benefícios.";
    }

    if (impeditivosBooleans.beneficioIncompativel) {
      beneficiosContent = impeditivosDosprev.beneficioIncompativel.length
          ? impeditivosDosprev.beneficioIncompativel.map(beneficio => `<strong><span>${beneficio}</span></strong>`).join(", ")
          : "Sem informações de benefícios.";
    }

    return `
    <p class="impeditivos-field">
      <strong><span>CONCESSÃO ADMINISTRATIVA / BENEFÍCIO ATIVO / BENEFÍCIO INCOMPATÍVEL:</span></strong>
      <span>Foi identificado que a parte autora a) recebe (ou recebeu) administrativamente o benefício pleiteado nos presentes autos; b) recebe um benefício incompatível com a qualidade de segurado especial.</span><br>
      ${beneficiosContent}
    </p>
  `;
}