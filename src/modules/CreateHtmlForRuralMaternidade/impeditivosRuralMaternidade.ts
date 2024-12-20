import { IObjInfoImpeditivosRM } from "../GetInformationFromSapiensForPicaPau/dto/RuralMaternidade/interfaces/IObjInfoImpeditivos";
import { IResponseLabraAutorConjuge } from "../GetInformationFromSapiensForPicaPau/dto/Sislabra/interfaces/IResponseLabraAutorConjuge";
import { HtmlIImpeditivosRuralMaternidadeDTO } from "./dtos/HtmlImpeditivosRMDTO";


export class ImpeditivosHtmlRuralMaternidade {
    async execute(
        data: HtmlIImpeditivosRuralMaternidadeDTO, 
        nome: string, 
        tipo: string, 
        impedimentosLabra: IResponseLabraAutorConjuge, 
        impedimentosDosprev: IObjInfoImpeditivosRM): Promise<string> {

        const currentDate = new Date().toLocaleString();
        const getStatus = (value: boolean | null): string => {
            if (value === true) {
                return '<span style="color: red; font-weight: bold; font-size: 1.5em;">IMPEDITIVO</span>';
            } else if (value === false) {
                return '<span style="color: green; font-weight: bold; font-size: 1.5em;">LIMPO</span>';
            } else {
                return '<span style="color: gray; font-weight: bold; font-size: 1.5em;">SEM INFORMAÇÃO</span>';
            }
        };

        const attributeLabels: { [key: string]: string } = {
            marca: "MARCA",
            tipo: "TIPO",
            valorEstipulado: "VALOR ESTIPULADO",
            placa: "PLACA",
            renavam: "RENAVAM",
            anoFabricacao: "ANO DE FABRICAÇÃO",
            municipio: "MUNICÍPIO",
            restricao: "RESTRIÇÃO",
            salarioContrato: "SALÁRIO DO CONTRATO",
            ocupacao: "OCUPAÇÃO",
            empresa: "EMPRESA",
            nomeVinculado: "NOME VINCULADO",
            cpfOuCnpj: "CPF/CNPJ",
            tipoDeVinculo: "TIPO DE VÍNCULO",
            dataEntrada: "DATA DE ENTRADA",
            nomeImovel: "NOME DO IMÓVEL",
            sncr: "SNCR",
            numeroCafir: "NÚMERO CAFIR",
            dataInscricao: "DATA DE INSCRIÇÃO",
            localizacao: "LOCALIZAÇÃO",
            distrito: "DISTRITO",
            cep: "CEP",
            uf: "UF",
            vinculo: "ORIGEM DO VÍNCULO",
            dataInicio: "DATA DE INÍCIO",
            dataFim: "DATA DE FIM",
            filiacao: "TIPO DE FILIAÇÃO"
        };

        const renderImpedimentos = (impedimentos: any[], imp: string): string => {
            return impedimentos.map((item, index) => `
        <div style="margin-top: 10px;">
            <h4 style="font-size: 1em; color: darkblue; margin-bottom: 5px;">${imp} ${index + 1}</h4>
            <table style="font-size: 0.9em; color: blue; margin-top: 5px; width: 100%;">
                ${Object.entries(item).map(([key, value]) => `
                    <tr>
                        <td style="font-weight: bold; padding: 5px; border: 1px solid #ccc;">${attributeLabels[key] || key}:</td>
                        <td style="padding: 5px; border: 1px solid #ccc;">${value}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `).join('');
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
                h1 { font-size: 1.5em; font-weight: 600; text-align: center; color: red; }
                .title { font-size: 1.5em; font-weight: bold; }
                p { margin: 0; font-weight: bold; text-align: center; }
                .title-doc { font-size: 1.5em; color: blue; }
            </style>
        </head>
        <body>
            <h1>RESUMO DE IMPEDITIVOS - ${tipo}</h1>
            <br>
            <p>USUÁRIO: ${nome}</p>
            <p>DATA: ${currentDate}</p>
            <br>
            <table>
                <thead><tr><th><span class="title-doc">DOSPREV AUTOR</span></th></tr></thead>
                <tbody>
                    <tr><td><span class="title">REQUERIMENTO:</span> ${getStatus(data.requerimento)}</td></tr>
                    <tr>
                        <td><span class="title">EMPREGO:</span> ${getStatus(data.emprego)}
                            ${data.emprego && impedimentosDosprev.emprego.length ? renderImpedimentos(impedimentosDosprev.emprego, "EMPREGO") : ''}
                        </td>
                    </tr>
                    <tr><td><span class="title">VÍNCULO ABERTO:</span> ${getStatus(data.vinculoAberto)}</td></tr>
                    <tr><td><span class="title">CONCESSÃO ANTERIOR:</span> ${getStatus(data.concessaoAnterior)}</td></tr>
                    <tr><td><span class="title">LITISPENDÊNCIA:</span> ${getStatus(data.litispendencia)}</td></tr>
                </tbody>
            </table>
            <br><br>
            <br>
            <br>
            <table>
                <thead>
                    <tr>
                        <th><span class="title-doc">SISLABRA AUTOR</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="title">VEÍCULO:</span> ${getStatus(data.veiculoAutor)}
                            ${data.veiculoAutor && impedimentosLabra.autor.veiculos.length ? renderImpedimentos(impedimentosLabra.autor.veiculos, "VEÍCULO") : ''}
                        </td>
                    </tr>   
                    <tr>
                        <td><span class="title">EMPREGO:</span> ${getStatus(data.empregoAutor)}
                            ${data.empregoAutor && impedimentosLabra.autor.empregos.length ? renderImpedimentos(impedimentosLabra.autor.empregos, "EMPREGO") : ''}
                        </td>
                    </tr>
                    <tr>
                        <td><span class="title">IMÓVEL RURAL:</span> ${getStatus(data.imovelruralAutor)}
                            ${data.imovelruralAutor && impedimentosLabra.autor.imoveisRurais.length ? renderImpedimentos(impedimentosLabra.autor.imoveisRurais, "IMÓVEL") : ''}
                        </td>
                    </tr>
                    <tr>
                        <td><span class="title">EMPRESA:</span> ${getStatus(data.empresaAutor)}
                            ${data.empresaAutor && impedimentosLabra.autor.empresas.length ? renderImpedimentos(impedimentosLabra.autor.empresas, "EMPRESA") : ''}
                        </td>
                    </tr>
                </tbody>
            </table>
            <br><br>
            <br>
            <br>
            <table>
                <thead>
                    <tr>
                        <th><span class="title-doc">SISLABRA CONJUGE</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="title">VEÍCULO:</span> ${getStatus(data.veiculoConjuge)}
                            ${data.veiculoConjuge && impedimentosLabra.conjuge.veiculos.length ? renderImpedimentos(impedimentosLabra.conjuge.veiculos, "VEÍCULO") : ''}
                        </td>
                    </tr>   
                    <tr>
                        <td><span class="title">EMPREGO:</span> ${getStatus(data.empregoConjuge)}
                            ${data.empregoConjuge && impedimentosLabra.conjuge.empregos.length ? renderImpedimentos(impedimentosLabra.conjuge.empregos, "EMPREGO") : ''}
                        </td>
                    </tr>
                    <tr>
                        <td><span class="title">IMÓVEL RURAL:</span> ${getStatus(data.imovelruralConjuge)}
                            ${data.imovelruralConjuge && impedimentosLabra.conjuge.imoveisRurais.length ? renderImpedimentos(impedimentosLabra.conjuge.imoveisRurais, "IMÓVEL") : ''}
                        </td>
                    </tr>
                    <tr>
                        <td><span class="title">EMPRESA:</span> ${getStatus(data.empresaConjuge)}
                            ${data.empresaConjuge && impedimentosLabra.conjuge.empresas.length ? renderImpedimentos(impedimentosLabra.conjuge.empresas, "EMPRESA") : ''}
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>`;
        return html;
    }
}
