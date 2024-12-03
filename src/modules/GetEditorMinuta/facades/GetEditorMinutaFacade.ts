import { getEditorMinutaUseCase } from "..";
import { GetEditorMinutaDTO } from "../dtos/GetEditorMinutaDTO";

export async function GetEditorMinutaFacade(data: GetEditorMinutaDTO): Promise<any> {
    try {
        return await getEditorMinutaUseCase.execute(data);
    } catch (error) {
        throw new Error("Erro ao buscar minuta: " + error);
    }
}
