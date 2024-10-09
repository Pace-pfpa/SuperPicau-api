// EtiquetaUtils.ts
export class EtiquetaUtils {
    static gerarEtiqueta(tipo: string, impeditivos: string): string {
        return `${tipo} IMPEDITIVOS: ${impeditivos}`;
    }

    static isProcessoLimpo(response: string): boolean {
        return response === " *RURAL* " || response === " *LOAS* " || response === " *MATERNIDADE* ";
    }

    // Outros métodos relacionados a etiquetas
}
