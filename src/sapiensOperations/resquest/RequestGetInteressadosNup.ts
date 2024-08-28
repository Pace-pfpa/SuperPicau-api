export class RequestGetInteressadosNup {

    async execute(eq: number){
        const requestInteressadosNup = [
            {
              "action": "SapiensAdministrativo_Interessado",
              "method": "getInteressado",
              "data": [
                {
                  "fetch": [
                    "pessoa",
                    "pessoa.cadastrosIdentificadores",
                    "pessoa.modalidadeGeneroPessoa",
                    "pessoa.modalidadeQualificacaoPessoa",
                    "modalidadeInteressado",
                    "criadoPor",
                    "atualizadoPor",
                    "cargo"
                  ],
                  "filter": [
                    {
                      "property": "pasta.id",
                      "value": `eq: ${eq}`
                    }
                  ],
                  "apagados": 0,
                  "page": 1,
                  "start": 0,
                  "limit": 25
                }
              ],
              "type": "rpc",
              "tid": 9
            }
          ]

          return requestInteressadosNup;

    }
}