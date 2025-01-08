export class RequestTarefas {

    async execute(cpf: string): Promise<string> {
        const requestInteressados = `{
            "action": "SapiensMain_CadastroIdentificador",
            "method": "getCadastroIdentificador",
            "data": [
              {
                "fetch": [
                  "pessoa",
                  "pessoa.modalidadeQualificacaoPessoa",
                  "pessoa.modalidadeGeneroPessoa"
                ],
                "limit": 25,
                "page": 1,
                "query": "${cpf}",
                "start": 0
              }
            ],
            "tid": 18,
            "type": "rpc"
          }`;

          return requestInteressados;

    }
}