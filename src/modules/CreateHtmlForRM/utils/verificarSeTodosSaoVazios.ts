export const verificarSeTodosSaoVazios = (valores: any[]): boolean => {
    return valores.every(valor => !valor || (Array.isArray(valor) && valor.length === 0));
};