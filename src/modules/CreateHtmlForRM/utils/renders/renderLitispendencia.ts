export const renderLitispendencia = (litispendencia: boolean, processos: string[] | null): string => {
    if (!litispendencia) return "";

    const processosContent = processos?.length
        ? processos.map(processo => `<strong><span>${processo}</span></strong>`).join(", ")
        : "Sem informações de processos.";

    return `
        <p class="impeditivos-field">
            <strong><span>LITISPENDÊNCIA</span>:</strong> Foi identificada em relação ao(s) seguinte(s) processo(s):
            ${processosContent}
            <br>
            <span>PREQUESTIONAMENTO: Código de Processo Civil, artigos 337, § 3º, e 485, inciso V.</span>
        </p>
    `;
}