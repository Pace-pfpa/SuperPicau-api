export const renderTable = (items: any[], label: string, columns: string[]): string => {
    const columnLabels: { [key: string]: string } = {
        nomeVinculado: "NOME VINCULADO",
        cpfOuCnpj: "CPF/CNPJ",
        tipoDeVinculo: "TIPO DE VÍNCULO",
        dataEntrada: "DATA DE ENTRADA",
        salarioContrato: "SALÁRIO DO CONTRATO",
        ocupacao: "OCUPAÇÃO",
        empresa: "EMPRESA",
        marca: "MARCA",
        tipo: "TIPO",
        valorEstipulado: "VALOR ESTIPULADO",
        placa: "PLACA",
        renavam: "RENAVAM",
        anoFabricacao: "ANO DE FABRICAÇÃO",
        municipio: "MUNICÍPIO",
        restricao: "RESTRIÇÃO",
        nomeImovel: "NOME DO IMÓVEL",
        sncr: "SNCR",
        numeroCafir: "NÚMERO CAFIR",
        dataInscricao: "DATA DE INSCRIÇÃO",
        localizacao: "LOCALIZAÇÃO",
        distrito: "DISTRITO",
        cep: "CEP",
        uf: "UF",
        vinculo: "VÍNCULO",
        dataInicio: "DATA DE INÍCIO",
        dataFim: "DATA FIM",
        filiacao: "FILIAÇÃO",
    };

    const headers = columns
      .map((col) => `<th style="border: 1px solid #000; padding: 5px;">${columnLabels[col] || col}</th>`)
      .join("");

      const rows = items
        .map(
          (item) =>
            `<tr>${columns
                .map(
                  (col) =>
                    `<td style="border: 1px solid #000; padding: 5px;">${
                      item[col] || "-"
                  }</td>`
          )
          .join("")}</tr>`
        )
        .join("");

      return `
        <p><strong>${label}:</strong></p>
        <table class="centralizado" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
}