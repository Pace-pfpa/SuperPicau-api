export class SeruradoEspecial{
    async handle(parginaDosPrev: any): Promise<number>{
                    const procurarVariavelSeguradoEspecial: number = parginaDosPrev.indexOf("SEGURADO_ESPECIAL");
                    return procurarVariavelSeguradoEspecial;
    }
    
}
