import { DetalhesRenda } from "../../../GetInformationFromSapiensForPicaPau/BuscarImpedimentos/calculoLoas/dto/DetalhesRenda";

export const renderRendaFamiliar = (impeditivo: boolean, renda: DetalhesRenda | null): string => {
    if (!impeditivo) return '';

    let resultado = `
        <p class="impeditivos-field">
            <strong><span>RENDA IMCOMPATÍVEL:</span></strong>
            <span> A parte autora possui meios de prover a própria manutenção ou de tê-la provida por sua família, com renda incompátivel para a percepção do benefício assistencial.</span>
            <br />
            <span>${renda.rendaFamiliar}</span>
            <br /> Número de Membros da Família: ${renda.numMembrosFamilia}
            <br /> Média da Renda - Data de Ajuizamento: R$ ${renda.mediaAjuizamento.toFixed(2)}
            <br /> Média da Renda - Data de Requerimento: R$ ${renda.mediaRequerimento.toFixed(2)}
            <br /> Salário Mínimo - Data de Ajuizamento: R$ ${renda.salarioMinimoAjuizamento.toFixed(2)}
            <br /> Salário Mínimo - Data de Requerimento: R$ ${renda.salarioMinimoRequerimento.toFixed(2)}
        </p>
    `;

    if (renda.isFallback && renda.fallbackInfo?.length) {
        const fallbackTableRows = renda.fallbackInfo
            .map((info) => `
                <tr>
                    <td style="border: 1px solid #000; padding: 5px;">${info.nome}</td>
                    <td style="border: 1px solid #000; padding: 5px;">${info.cpf}</td>
                    <td style="border: 1px solid #000; padding: 5px;">R$ ${info.fallbackRemuneracao.toFixed(2)}</td>
                    <td style="border: 1px solid #000; padding: 5px;">${info.fallbackDate}</td>
                </tr>
            `).join('');
        
        resultado += `
            <p><strong>Valores encontrados fora das datas de ajuizamento e/ou requerimento:</strong></p>
            <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
            <thead>
            <tr>
                <th style="border: 1px solid #000; padding: 5px;">Nome</th>
                <th style="border: 1px solid #000; padding: 5px;">CPF</th>
                <th style="border: 1px solid #000; padding: 5px;">Remuneração</th>
                <th style="border: 1px solid #000; padding: 5px;">Data</th>
            </tr>
            </thead>
            <tbody>
                ${fallbackTableRows}
            </tbody>
            </table>
        `;
    }

    return resultado;
}