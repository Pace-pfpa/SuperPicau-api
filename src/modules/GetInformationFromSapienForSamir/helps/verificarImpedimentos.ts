export function verificarImpedimentos(str: string) {

    const impeditivos = ['ADVOGADO',
                        'CADÚNICO',
                        'LITISPENDÊNCIA', 
                        'BPC ATIVO', 
                        'BENEFÍCIO ATIVO', 
                        'IDADE', 
                        'AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO',
                        'RENDA MEDIA',
                        'RENDA ALTA',
                        'RENDA ELEVADA',
                        'EMPRESA',
                        'BENS TSE',
                        'VEÍCULOS',
                        'IMÓVEL SP',
                        'IMÓVEL RURAL',
                        'EMBARCAÇÃO',
                        'AERONAVE',
                        'EMPRESA GF',
                        'BENS TSE GF',
                        'VEÍCULOS GF',
                        'IMÓVEL SP GF',
                        'IMÓVEL RURAL GF',
                        'EMBARCAÇÃO GF',
                        'AERONAVE GF',
                        'SISLABRA AUTOR NÃO EXISTE',
                        'SISLABRA GF NÃO EXISTE' ]
    
    // Divide a string original em um array de palavras/frases
    const palavrasNaString = str.split('-').map(palavra => palavra.trim());
    
    // Verifica quais das palavras/frases específicas estão presentes na string original
    const presentes = impeditivos.filter(palavra => palavrasNaString.includes(palavra));
    
    return presentes;

}