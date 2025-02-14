export const renderConcessaoRural = (concessao: boolean): string => {
    if (!concessao) return "";

    return `
    <p class="impeditivos-field">
      <strong><span>CONCESSÃO ADMINISTRATIVA:</span></strong>
      <span>Foi identificado que o benefício solicitado pela parte autora já foi concedido pelo INSS.</span>
     </p>
  `;
}