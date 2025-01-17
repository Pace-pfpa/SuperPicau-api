import { IPicaPauCalculeDTO } from "../../dto";
import { calcularRendaFamiliar } from "../calculoLoas/calcularRendaFamiliar";
import { DetalhesRenda } from "../calculoLoas/dto/DetalhesRenda";
import { etiquetarRenda } from "../calculoLoas/etiquetarRenda";

export async function informationRenda(
    arrayObjetosEnvolvidos: IPicaPauCalculeDTO[], 
    grupoFamiliar: string[], 
    infoRequerente: IPicaPauCalculeDTO
): Promise< { impeditivo: string[], objImpeditivoRenda: DetalhesRenda} > {
    const resultadoRenda = await calcularRendaFamiliar(arrayObjetosEnvolvidos, grupoFamiliar.length + 1, infoRequerente);
    const impedimentoRenda: string[] = await etiquetarRenda(resultadoRenda.impeditivo);
    return { impeditivo: impedimentoRenda, objImpeditivoRenda: resultadoRenda.detalhesRenda }
}