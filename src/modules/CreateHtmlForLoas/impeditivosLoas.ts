import { HtmlIImpeditivosLoasDTO } from "../../DTO/HtmlImpeditivosLoasDTO";

// HTML COM RESUMO DE IMPEDITIVOS - LOAS E SISLABRA LOAS
export class ImpeditivosHtmlLoas {
    async execute(data: HtmlIImpeditivosLoasDTO): Promise<string>{
        const getStatus = (value: boolean | null): string => {
            if (value === true) {
                return '<span style="color: red; font-weight: bold;">IMPEDITIVO</span>';
            } else if (value === false) {
                return '<span style="color: green; font-weight: bold;">LIMPO</span>';
            } else {
                return ' <span style="color: gray; font-weight: bold;">SEM INFORMAÇÃO</span>';
            }
        }


        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                }
        
                table {
                    border-collapse: collapse;
                    width: 1000px;
                    margin-left: auto;
                    margin-right: auto;
                }
        
                h1 {
                    font-size: 1.2em;
                    font-weight: 600;
                    padding: 20px;
                    text-align: center;
                }
        
                th, td {
                    border: 1px solid black;
                    padding: 10px;
                }
        
                tr:nth-child(even){
                    background-color: rgb(228, 228, 228);
                }
                h1{
                    color: red;
                }
            
            </style>
        </head>
        <body>
            <h1>RESUMO DE IMPEDITIVOS</h1>
            <br>
            <br>
            <table>
                <thead>
                    <tr>
                        <th>DOSPREV AUTOR</th>
                    </tr>
                </thead>
                <tbody>  
                    <tr>
                        <td>CADÚNICO: ${getStatus(data.cadunico)}</td>
                    </tr>
                    <tr>
                        <td>LITISPENDÊNCIA: ${getStatus(data.litispendencia)}</td>
                    </tr>    
                    <tr>
                        <td>BPC ATIVO: ${getStatus(data.bpc)}</td>
                    </tr>
                    <tr>
                        <td>BENEFÍCIO ATIVO: ${getStatus(data.beneficio)}</td>
                    </tr>
                    <tr>
                        <td>IDADE: ${getStatus(data.idade)}</td>
                    </tr>
                    <tr>
                        <td>REQUERIMENTO: ${getStatus(data.requerimento)}</td>
                    </tr>
                    <tr>
                        <td>RENDA: ${getStatus(data.renda)}</td>
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
                        <th>SISLABRA AUTOR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>EMPRESA: ${getStatus(data.empresaAutor)}</td>
                    </tr>   
                    <tr>
                        <td>BENS TSE: ${getStatus(data.bensAutor)}</td>
                    </tr>
                    <tr>
                        <td>VEÍCULOS: ${getStatus(data.veiculoAutor)}</td>
                    </tr>    
                    <tr>
                        <td>IMÓVEL SP: ${getStatus(data.imovelspAutor)}</td>
                    </tr>
                    <tr>
                        <td>IMÓVEL RURAL: ${getStatus(data.imovelruralAutor)}</td>
                    </tr>
                    <tr>
                        <td>EMBARCAÇÃO: ${getStatus(data.embarcacaoAutor)}</td>
                    </tr>
                    <tr>
                        <td>AERONAVE: ${getStatus(data.aeronaveAutor)}</td>
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
                        <th>SISLABRA GRUPO FAMILIAR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>EMPRESA: ${getStatus(data.empresaGF)}</td>
                    </tr>   
                    <tr>
                        <td>BENS TSE: ${getStatus(data.bensGF)}</td>
                    </tr>
                    <tr>
                        <td>VEÍCULOS: ${getStatus(data.veiculoGF)}</td>
                    </tr>    
                    <tr>
                        <td>IMÓVEL SP: ${getStatus(data.imovelspGF)}</td>
                    </tr>
                    <tr>
                        <td>IMÓVEL RURAL: ${getStatus(data.imovelruralGF)}</td>
                    </tr>
                    <tr>
                        <td>EMBARCAÇÃO: ${getStatus(data.embarcacaoGF)}</td>
                    </tr>
                    <tr>
                        <td>AERONAVE: ${getStatus(data.aeronaveGF)}</td>
                    </tr>
                </tbody>
            </table>
            
        </body>
        </html>`
        return html;
    }
}


