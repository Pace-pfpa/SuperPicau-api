import { arrayInteressados } from "../../../CreateInterested/Helps/ArrayInteressados";
import { GetInteressadosReq } from "../../../CreateInterested/RequisicaoAxiosTarefas/GetInteressadosReq";
import { IDossieSocialInfo } from "../../dto";

export async function getGrupoFamiliarCpfs(
    tarefaPastaID: number, 
    cookie: string,
    cpfCapa: string,
    dossieSocialInfo: IDossieSocialInfo
): Promise<string[]> {
    const inputArray = await GetInteressadosReq(tarefaPastaID, cookie);
    const arrayEnvolvidos = arrayInteressados(inputArray);
    
    const grupoFamiliarCpfs = dossieSocialInfo?.grupoFamiliarCpfs || [];
    const updated_cpf_dos_familiares2 = [...grupoFamiliarCpfs, ...arrayEnvolvidos.filter(cpf => {
        return cpf !== '0000000000-' && cpf !== cpfCapa && cpf.length <= 11 && !grupoFamiliarCpfs.includes(cpf);
    })];
    
    return updated_cpf_dos_familiares2;
}