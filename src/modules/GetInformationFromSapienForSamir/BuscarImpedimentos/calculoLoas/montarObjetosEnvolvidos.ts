import { getInfoEnvDossieNormal } from "../../helps/getInfoEnvDossieNormal";
import { getInfoEnvDossieSuper } from "../../helps/getInfoEnvDossieSuper";

export async function montarObjetosEnvolvidos(
    arrayDossieEnvolvidosNormal: any[], 
    arrayDossieEnvolvidosSuper: any[], 
    infoRequerente: any, 
    cookie: string
) {
    let arrayObjetosEnvolvidos = [];

    for (let dossie of arrayDossieEnvolvidosNormal) {
        const objectEnvolvido = await getInfoEnvDossieNormal(cookie, dossie, infoRequerente.dataRequerimento);
        if (objectEnvolvido) arrayObjetosEnvolvidos.push(objectEnvolvido);
    }

    for (let dossie of arrayDossieEnvolvidosSuper) {
        const objectEnvolvido = await getInfoEnvDossieSuper(cookie, dossie, infoRequerente.dataRequerimento);
        if (objectEnvolvido) arrayObjetosEnvolvidos.push(objectEnvolvido);
    }

    arrayObjetosEnvolvidos.push(infoRequerente);

    console.log('--POLO ATIVO E FAMILIARES');
    console.log(arrayObjetosEnvolvidos)

    return arrayObjetosEnvolvidos;
}
