import { HtmlIImpeditivosLoasDTO } from "../../DTO/HtmlImpeditivosLoasDTO";

// HTML COM RESUMO DE IMPEDITIVOS - LOAS E SISLABRA LOAS
export class ImpeditivosHtmlLoas {
    async execute(data: HtmlIImpeditivosLoasDTO): Promise<string>{
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
                        <td>ADVOGADO: ${data.advogado}</td>
                    </tr>   
                    <tr>
                        <td>CADÚNICO: ${data.cadunico}</td>
                    </tr>
                    <tr>
                        <td>LITISPENDÊNCIA: ${data.litispendencia}</td>
                    </tr>    
                    <tr>
                        <td>BPC ATIVO: ${data.bpc}</td>
                    </tr>
                    <tr>
                        <td>BENEFÍCIO ATIVO: ${data.beneficio}</td>
                    </tr>
                    <tr>
                        <td>IDADE: ${data.idade}</td>
                    </tr>
                    <tr>
                        <td>REQUERIMENTO: ${data.requerimento}</td>
                    </tr>
                    <tr>
                        <td>RENDA: ${data.renda}</td>
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
                        <td>EMPRESA: ${data.empresaAutor}</td>
                    </tr>   
                    <tr>
                        <td>BENS TSE: ${data.bensAutor}</td>
                    </tr>
                    <tr>
                        <td>VEÍCULOS: ${data.veiculoAutor}</td>
                    </tr>    
                    <tr>
                        <td>IMÓVEL SP: ${data.imovelspAutor}</td>
                    </tr>
                    <tr>
                        <td>IMÓVEL RURAL: ${data.imovelruralAutor}</td>
                    </tr>
                    <tr>
                        <td>EMBARCAÇÃO: ${data.embarcacaoAutor}</td>
                    </tr>
                    <tr>
                        <td>AERONAVE: ${data.aeronaveAutor}</td>
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
                        <td>EMPRESA: ${data.empresaGF}</td>
                    </tr>   
                    <tr>
                        <td>BENS TSE: ${data.bensGF}</td>
                    </tr>
                    <tr>
                        <td>VEÍCULOS: ${data.veiculoGF}</td>
                    </tr>    
                    <tr>
                        <td>IMÓVEL SP: ${data.imovelspGF}</td>
                    </tr>
                    <tr>
                        <td>IMÓVEL RURAL: ${data.imovelruralGF}</td>
                    </tr>
                    <tr>
                        <td>EMBARCAÇÃO: ${data.embarcacaoGF}</td>
                    </tr>
                    <tr>
                        <td>AERONAVE: ${data.aeronaveGF}</td>
                    </tr>
                </tbody>
            </table>
            
        </body>
        </html>`
        return html;
    }
}


