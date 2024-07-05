import { HtmlIImpeditivosDTO } from "../../DTO/HtmlImpeditivosDTO";

export class ImpeditivosHtmlSemConjuge{
    async execute(data: HtmlIImpeditivosDTO): Promise<string>{
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
                        <td>IDADE MÍNIMA: ${data.idadeMinima}</td>
                    </tr>   
                    <tr>
                        <td>LITISPENDÊNCIA: ${data.litispendencia}</td>
                    </tr>
                    <tr>
                        <td>CONCESSÃO ANTERIOR: ${data.concessaoAnterior}</td>
                    </tr>    
                    <tr>
                        <td>VÍNCULOS EMPREGATÍCIOS: ${data.vinculosEmpregaticios}</td>
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
                        <td>CÔNJUGE: ${data.conjugeAutor}</td>
                    </tr>   
                    <tr>
                        <td>VEÍCULO: ${data.veiculoAutor}</td>
                    </tr>
                    <tr>
                        <td>EMPRESA: ${data.empresaAutor}</td>
                    </tr>    
                    <tr>
                        <td>IMÓVEL: ${data.imovelAutor}</td>
                    </tr>
                    <tr>
                        <td>ENDEREÇOS: ${data.enderecosAutor}</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>`
        return html;
    }
}


