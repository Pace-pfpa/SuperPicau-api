import QueryString from "qs"

export class RequestPessoaFisica {

    async execute(cpf: string) {
        const payload = QueryString.stringify({
            cpf: `${cpf}`
          });

        return payload
    }
}