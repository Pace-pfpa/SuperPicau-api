import { CorrigirCpfComZeros } from "../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getCPFDosPrevNormal } from "./getCPFDosPrevNormal";
import { getCPFDosPrevSuper } from "./getCPFDosPrevSuper";

// Função auxiliar para validar se o dossiê tem componentes digitais válidos
function validarDossie(dossie: any): boolean {
    return dossie.documentoJuntado?.componentesDigitais?.length > 0 && !!dossie.documentoJuntado.componentesDigitais[0].id;
}

// Função auxiliar para buscar o CPF no dossiê normal ou super
async function buscarCpfNoDossie(dossie: any, tipo: 'normal' | 'super', cookie: string): Promise<string | null> {
    if (tipo === 'normal') {
        return getCPFDosPrevNormal(dossie, cookie);
    } else {
        return getCPFDosPrevSuper(dossie, cookie);
    }
}

// Função auxiliar para verificar se o CPF do dossiê corresponde ao CPF fornecido
async function verificarCpfCorrespondente(dossie: any, cpf: string, tipo: 'normal' | 'super', cookie: string): Promise<boolean> {
    const cpfDossie = await buscarCpfNoDossie(dossie, tipo, cookie);
    if (!cpfDossie) return false;
    return cpf.trim() === CorrigirCpfComZeros(cpfDossie.trim());
}

// Função auxiliar para comparar dossiês pela numeração sequencial
function compararDossiesPorSequencial(dossieNormal: any, dossieSuper: any): number {
    return dossieNormal.numeracaoSequencial - dossieSuper.numeracaoSequencial;
}

export async function verificarDossieMaisAtual(cpf: string, cookie:string, normalDossie?: any[], superDossie?: any[]): Promise<any> {
    
 try {
     // 1. Verifica apenas dossiês normais
     if (normalDossie && !superDossie) {
        console.log("-> DOSPREV: CASILLAS (Somente dossiês normais)");
        for (let i = 0; i < normalDossie.length; i++) {
            if (!validarDossie(normalDossie[i])) {
                console.warn(`Alerta: Dossiê normal inválido detectado na posição ${i}. Continuando a busca.`);
                continue;
            }

            if (await verificarCpfCorrespondente(normalDossie[i], cpf, 'normal', cookie)) {
                console.log(`Dossiê normal retornado da posição ${i}, ${normalDossie[i].numeracaoSequencial} do array normal.`);
                return [normalDossie[i], 0];
            }
        }
        return new Error("Nenhum dossiê normal encontrado para o CPF fornecido.");
    }

    // 2. Verifica apenas dossiês super
    if (!normalDossie && superDossie) {
        console.log("-> DOSPREV: RAMOS (Somente dossiês super)");
        for (let i = 0; i < superDossie.length; i++) {
            if (!validarDossie(superDossie[i])) {
                console.warn(`Alerta: Dossiê super inválido detectado na posição ${i}. Continuando a busca.`);
                continue;
            }

            if (await verificarCpfCorrespondente(superDossie[i], cpf, 'super', cookie)) {
                console.log(`Dossiê super retornado da posição ${i}, ${superDossie[i].numeracaoSequencial} do array super.`);
                return [superDossie[i], 1];
            }
        }
        return new Error("Nenhum dossiê super encontrado para o CPF fornecido.");
    }
    
    // 3. Quando existem dossiês normais e super
    if (normalDossie && superDossie) {
        console.log('-> DOSPREV: ARBELOA (Dossiês normais e super)');

        let dossieNormalEncontrado: any = null;
        let dossieSuperEncontrado: any = null;
        let posicaoNormalEncontrado: number = -1;
        let posicaoSuperEncontrado: number = -1;

        for (let i = 0; i < normalDossie.length; i++) {
            if (!validarDossie(normalDossie[i])) {
                console.warn(`Alerta: Dossiê normal inválido detectado na posição ${i}. Continuando a busca.`);
                continue;
            }

            if (await verificarCpfCorrespondente(normalDossie[i], cpf, 'normal', cookie)) {
                dossieNormalEncontrado = normalDossie[i];
                posicaoNormalEncontrado = i;
                break;
            }
        }

        for (let i = 0; i < superDossie.length; i++) {
            if (!validarDossie(superDossie[i])) {
                console.warn(`Alerta: Dossiê super inválido detectado na posição ${i}. Continuando a busca.`);
                continue;
            }

            if (await verificarCpfCorrespondente(superDossie[i], cpf, 'super', cookie)) {
                dossieSuperEncontrado = superDossie[i];
                posicaoSuperEncontrado = i;
                break;
            }
        }

        if (dossieNormalEncontrado && dossieSuperEncontrado) {
            if (compararDossiesPorSequencial(dossieNormalEncontrado, dossieSuperEncontrado) > 0) {
                console.log(`Dossiê normal retornado da posição ${posicaoNormalEncontrado}, ${dossieNormalEncontrado.numeracaoSequencial} do array normal.`);
                return [dossieNormalEncontrado, 0];
            } else {
                console.log(`Dossiê super retornado da posição ${posicaoSuperEncontrado}, ${dossieSuperEncontrado.numeracaoSequencial} do array super.`);
                return [dossieSuperEncontrado, 1];
            }
        }

         if (dossieNormalEncontrado) {
            console.log(`Dossiê normal retornado da posição ${posicaoNormalEncontrado}, ${dossieNormalEncontrado.numeracaoSequencial} do array normal.`);
            return [dossieNormalEncontrado, 0];
        }

        if (dossieSuperEncontrado) {
            console.log(`Dossiê super retornado da posição ${posicaoSuperEncontrado}, ${dossieSuperEncontrado.numeracaoSequencial} do array super.`);
            return [dossieSuperEncontrado, 1];
        }

        return new Error("Nenhum dossiê encontrado para o CPF fornecido.");
    }

    return new Error("Nenhum dossiê fornecido.");
  } catch(e){
     return new Error("DOSPREV COM FALHA NA PESQUISA")
  }
}