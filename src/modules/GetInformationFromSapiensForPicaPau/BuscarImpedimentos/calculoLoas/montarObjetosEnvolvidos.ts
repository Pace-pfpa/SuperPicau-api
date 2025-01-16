import { ResponseArvoreDeDocumentoDTO } from "../../../GetArvoreDocumento";
import { IPicaPauCalculeDTO } from "../../dto";
import { getInfoEnvDossieNormal } from "../../helps/getInfoEnvDossieNormal";
import { getInfoEnvDossieSuperRefactor } from "../../helps/getInfoEnvDossieSuperRefactor";

export async function montarObjetosEnvolvidos(
    arrayDossieEnvolvidosNormal: ResponseArvoreDeDocumentoDTO[], 
    arrayDossieEnvolvidosSuper: ResponseArvoreDeDocumentoDTO[], 
    infoRequerente: IPicaPauCalculeDTO, 
    cookie: string
): Promise<IPicaPauCalculeDTO[]> {
    const arrayObjetosEnvolvidos: IPicaPauCalculeDTO[] = [];

    console.log("Processing normal dossiers...");
    for (const dossie of arrayDossieEnvolvidosNormal) {
        try {
            const objectEnvolvido = await getInfoEnvDossieNormal(cookie, dossie, infoRequerente.dataRequerimento);
            if (objectEnvolvido) {
                arrayObjetosEnvolvidos.push(objectEnvolvido);
            }
        } catch (error) {
            console.error(`Error processing normal dossiers: ${error.message}`);
        }
    }

    console.log("Processing super dossiers...");
    for (const dossie of arrayDossieEnvolvidosSuper) {
        try {
            const objectEnvolvido = await getInfoEnvDossieSuperRefactor(cookie, dossie, infoRequerente.dataRequerimento);
            if (objectEnvolvido) {
                arrayObjetosEnvolvidos.push(objectEnvolvido);
            }
        } catch (error) {
            console.error(`Error processing super dossiers: ${error.message}`);
        }
    }

    arrayObjetosEnvolvidos.push(infoRequerente);

    console.log('--POLO ATIVO E FAMILIARES');
    console.log(arrayObjetosEnvolvidos);

    return arrayObjetosEnvolvidos;
}
