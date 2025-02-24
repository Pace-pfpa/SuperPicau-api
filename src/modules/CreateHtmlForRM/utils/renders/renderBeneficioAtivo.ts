export const renderBeneficioAtivo = (hasBeneficio: boolean, beneficio: string): string => {
    if (!hasBeneficio) return "";

    const content =  `<strong><span>${beneficio}</span></strong>`;

    return `
    <p class="impeditivos-field">
      <strong><span>BENEFÍCIO INCOMPATÍVEL ATIVO:</span></strong>
      <span>A parte autora possui benefício ativo incompatível que impossibilita a percepção do benefício assistencial.</span>
      <br>
      ${content}
      <br>
    </p>
  `;
}