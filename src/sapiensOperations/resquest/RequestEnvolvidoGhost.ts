export class RequestEnvolvidoGhost {

    async execute(cpf: string) {
        const requestEnvolvidoGhost = {
          "action": "SapiensMain_CadastroIdentificador",
          "method": "getCadastroIdentificador",
          "data": [
              {
                  "fetch": [
                      "pessoa",
                      "pessoa.modalidadeQualificacaoPessoa",
                      "pessoa.modalidadeGeneroPessoa"
                  ],
                  "query": `${cpf}`,
                  "page": 1,
                  "start": 0,
                  "limit": 25
              }
          ],
          "type": "rpc",
          "tid": 32
      }
              
        

        return requestEnvolvidoGhost
    }
}