export async function etiquetarRenda(resultadoRenda: string): Promise<string[]> {
    const response: string[] = [];
    if (resultadoRenda === 'ELEVADA') {
        response.push('RENDA ELEVADA');
    } else if (resultadoRenda === 'ALTA') {
        response.push('RENDA ALTA');
    } else if (resultadoRenda === 'MEDIA') {
        response.push('RENDA MEDIA');
    }

    console.log('Resultado da Renda:', response);
    return response;
}
