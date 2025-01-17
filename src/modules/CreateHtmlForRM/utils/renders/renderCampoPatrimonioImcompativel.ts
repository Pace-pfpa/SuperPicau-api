export const renderCampoPatrimonioImcompativel = (titulo: string, valor?: string | null): string => {
    return valor ? `
      <p class="impeditivos-field">
        <strong><span>${titulo}: </span></strong>
        <span>${valor}</span>
      </p>
    ` : "";
}