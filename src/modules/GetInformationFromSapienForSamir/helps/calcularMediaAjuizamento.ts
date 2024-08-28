import { IPicaPauCalculeDTO } from "../../../DTO/InformationsForCalculePicaPau"

export function calcularMediaAjuizamento (objs: IPicaPauCalculeDTO[], total: number): number {
    
    if (objs.length === 0) {
        throw new Error('O array de objetos está vazio.');
    }

    const somaRemuneracoes = objs.reduce((soma, obj) => soma + obj.remuneracaoAjuizamento, 0);

    const resultado = somaRemuneracoes / total;

    return resultado;
}

