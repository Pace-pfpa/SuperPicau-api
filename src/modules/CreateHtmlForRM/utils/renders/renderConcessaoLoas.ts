export const renderConcessaoLoas = (concessao: boolean, bpc: string): string => {
    if (!concessao) return "";

    const content =  `<strong><span>${bpc}</span></strong>`;

    return `
    <p class="impeditivos-field">
      <strong><span>CONCESSÃO ADMINISTRATIVA:</span></strong>
      <span>Foi identificado que o benefício solicitado pela parte autora já foi concedido pelo INSS.</span>
      <br>
      ${content}
      <br>
    </p>
  `;
}