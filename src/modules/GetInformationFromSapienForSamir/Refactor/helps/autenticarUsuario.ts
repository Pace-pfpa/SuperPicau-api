import { IGetInformationsFromSapiensDTO } from "../../../../DTO/GetInformationsFromSapiensDTO";
import { getUsuarioUseCase } from "../../../GetUsuario";
import { IUsuarioResponse } from "../../../GetUsuario/DTO/IUsuarioResponse";
import { loginUseCase } from "../../../LoginUsuario";

export async function autenticarUsuario(data: IGetInformationsFromSapiensDTO): Promise<{cookie: string, usuario: IUsuarioResponse[]}> {
    const cookie = await loginUseCase.execute(data.login);
    const usuario = await getUsuarioUseCase.execute(cookie);
    return { cookie, usuario };
}
