import { IPicaPauCalculeDTO } from "../../dto";
import { calcularRendaFamiliar } from "../calculoLoas/calcularRendaFamiliar";
import { etiquetarRenda } from "../calculoLoas/etiquetarRenda";

export async function informationRenda(arrayObjetosEnvolvidos: IPicaPauCalculeDTO[], grupoFamiliar: string[], infoRequerente: IPicaPauCalculeDTO): Promise<string[]> {
    const resultadoRenda = await calcularRendaFamiliar(arrayObjetosEnvolvidos, grupoFamiliar.length + 1, infoRequerente);
    const impedimentoRenda: string[] = await etiquetarRenda(resultadoRenda);
    return impedimentoRenda;
}