export const estilos = (): string => {
    return `
        <style>
                    body { font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; counter-reset: H1 numerado; margin-top: 5%; margin-right: auto; margin-left: auto; max-width: 210mm; line-height: 1.2em; }
                    .centralizado { text-align: center; text-indent: 0; }
                    .direita { text-align: right; text-indent: 0; }
                    .esquerda { text-align: left; text-indent: 0; }
                    p { text-indent: 25mm; text-align: justify; font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; margin-top: 0; margin-bottom: 0.2em; line-height: 1.2em; }
                    h1:before { content: counter(H1) ". "; counter-increment: H1; display: inline-block; width: 25mm; }
                    h1 { counter-reset: H2; font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; text-align: justify; font-weight: bold; text-transform: uppercase; margin-top: 0; margin-bottom: 0.2em; line-height: 1.2em; }
                    h2:before { content: counter(H1) "." counter(H2) " "; counter-increment: H2; display: inline-block; width: 25mm; }
                    h2 { font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; text-align: justify; font-weight: bold; margin-top: 0; margin-bottom: 0.2em; line-height: 1.2em; }
                    p.numerado:before { content: counter(numerado) ". "; counter-increment: numerado; display: inline-block; width: 25mm; font-weight: normal; }
                    p.numerado { text-indent: 0mm; text-align: justify; font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; margin-top: 0; margin-bottom: 0.2em; line-height: 1.2em; font-weight: normal; }
                    img { max-width: 185mm; }
                    table { border-width: 1px; border-spacing: 2px; border-color: black; border-collapse: collapse; font-size: 11pt; max-width: 210mm; }
                    table th { border-width: 1px; padding: 2px; border-color: black; font-size: 11pt; }
                    table td { border-width: 1px; padding: 2px; border-color: black; font-size: 11pt; }
                    table td p { text-align: justify; text-indent: 0mm; }
                    ul { font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; text-align: justify; list-style-type: circle; margin-left: 18mm; }
                    ol { font-family: "Times New Roman, Times", sans-serif; font-size: 11pt; text-align: justify; margin-left: 18mm; }
                    blockquote { font-family: "Times New Roman, Times", sans-serif; font-size: 10pt; text-align: justify; padding-left: 40mm; padding-right: 0mm; margin-top: 0; margin-bottom: 0.2em; margin-right: 0mm; }
                    p span.cke_widget_inline { text-indent: 0mm !important; }
                    section ol { font-family: "Times New Roman, Times", sans-serif; margin-left: 2mm !important; }
                    section.footnotes { margin-top: 4.2mm; padding-top: 2.2mm; }
                    span[data-service] { background-color: yellow; font-family: "Courier", sans-serif; }
                    .impeditivos-field { padding: 10px; }
        </style>
    `;
}