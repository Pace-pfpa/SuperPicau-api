import QueryString from "qs"

export class RequestPessoaFisica {

    async execute(cpf: string): Promise<string> {
        const payload = QueryString.stringify({
            cpf: `${cpf}`
          });

        return payload
    }
}