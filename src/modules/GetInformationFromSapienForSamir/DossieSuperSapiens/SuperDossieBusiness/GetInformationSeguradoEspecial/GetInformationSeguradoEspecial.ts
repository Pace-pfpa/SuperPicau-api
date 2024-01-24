export class SeruradoEspecialNewDossie{
    async handle(parginaDosPrev: any): Promise<number>{
                    const procurarVariavelSeguradoEspecial: number = parginaDosPrev.indexOf("SEGURADO_ESPECIAL");
                    return procurarVariavelSeguradoEspecial;
    }
    
}
