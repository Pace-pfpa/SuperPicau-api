import { LoginSapiens } from '../../pytonRequest/loginSapiens'
import { LoginDTO } from './dtos/LoginDTO';

export class LoginUseCase {
    async execute(data: LoginDTO): Promise<string> {
        const loginResponse = await LoginSapiens(data)

        const match = RegExp(/\((\w+),\s*'([^']+)'\)/).exec(loginResponse);

        if (!match) {
            throw new Error("Formato de resposta inesperado do LoginSapiens");
        }

        const [_, booleanStr, message] = match;
        const isSuccess = booleanStr === "True";

        return isSuccess ? message : `Erro: ${message}`;
    }
}