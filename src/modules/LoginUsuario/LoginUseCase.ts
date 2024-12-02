import { LoginSapiens } from '../../pytonRequest/loginSapiens'
import { LoginDTO } from './dtos/LoginDTO';

export class LoginUseCase {
    async execute(data: LoginDTO): Promise<string> {
        console.log("login inicializado")
        const loginIsTrue = await LoginSapiens(data)
        const verifyBoolean = loginIsTrue.split("(")[1].split(",")[0].trim();
        if(verifyBoolean == "False") throw new Error()
        return loginIsTrue.split("(")[1].split("'")[1];
    }
}