import { HtmlIImpeditivosRuralMaternidadeDTO } from "../../DTO/HtmlImpeditivosRuralMaternidadeDTO";

export class ImpeditivosHtmlRuralMaternidade {
    async execute(data: HtmlIImpeditivosRuralMaternidadeDTO, nome: string, tipo: string): Promise<string> {
        const currentDate = new Date().toLocaleString();
        const getStatus = (value: boolean | null): string => {
            if (value === true) {
                return '<span style="color: red; font-weight: bold;">IMPEDITIVO</span>';
            } else if (value === false) {
                return '<span style="color: green; font-weight: bold;">LIMPO</span>';
            } else {
                return ' <span style="color: gray; font-weight: bold;">SEM INFORMAÇÃO</span>';
            }
        };

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                body { font-family: Arial, Helvetica, sans-serif; }
                table { border-collapse: collapse; width: 1000px; margin: auto; }
                th, td { border: 1px solid black; padding: 10px; }
                tr:nth-child(even) { background-color: rgb(228, 228, 228); }
                h1 { font-size: 1.2em; font-weight: 600; text-align: center; color: red; }
            </style>
        </head>
        <body>
            <h1>RESUMO DE IMPEDITIVOS - ${tipo}</h1>
            <p>USUÁRIO: ${nome}</p>
            <p>DATA: ${currentDate}</p>
            <table>
                <thead><tr><th>DOSPREV AUTOR</th></tr></thead>
                <tbody>
                    <tr><td>REQUERIMENTO: ${getStatus(data.requerimento)}</td></tr>
                    <tr><td>EMPREGO: ${getStatus(data.emprego)}</td></tr>
                    <tr><td>VÍNCULO ABERTO: ${getStatus(data.vinculoAberto)}</td></tr>
                    <tr><td>CONCESSÃO ANTERIOR: ${getStatus(data.concessaoAnterior)}</td></tr>
                    <tr><td>LITISPENDÊNCIA: ${getStatus(data.litispendencia)}</td></tr>
                </tbody>
            </table>
            <br>
            <br>
            <br>
            <br>
            <table>
                <thead>
                    <tr>
                        <th>SISLABRA AUTOR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>VEÍCULO: ${getStatus(data.veiculoAutor)}</td>
                    </tr>   
                    <tr>
                        <td>EMPREGO: ${getStatus(data.empregoAutor)}</td>
                    </tr>
                    <tr>
                        <td>IMÓVEL RURAL: ${getStatus(data.imovelruralAutor)}</td>
                    </tr>
                    <tr>
                        <td>EMPRESA: ${getStatus(data.empresaAutor)}</td>
                    </tr>
                </tbody>
            </table>
            <br>
            <br>
            <br>
            <br>
            <table>
                <thead>
                    <tr>
                        <th>SISLABRA CONJUGE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>VEÍCULO: ${getStatus(data.veiculoConjuge)}</td>
                    </tr>   
                    <tr>
                        <td>EMPREGO: ${getStatus(data.empregoConjuge)}</td>
                    </tr>
                    <tr>
                        <td>IMÓVEL RURAL: ${getStatus(data.imovelruralConjuge)}</td>
                    </tr>
                    <tr>
                        <td>EMPRESA: ${getStatus(data.empresaConjuge)}</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>`;
        return html;
    }
}
