import { IRequerimentos } from "../../../dtos/interfaces/IRequerimentos";

export function getAllCessados(requerimentos: IRequerimentos[]): IRequerimentos[] {
    if (requerimentos.length > 0) {
        return requerimentos.filter((req) => req.status === "CESSADO");
    }

    return [];
}