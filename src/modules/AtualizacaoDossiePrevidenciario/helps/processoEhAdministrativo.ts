import { GetArvoreDocumentoDTO, getArvoreDocumentoUseCase, ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";

export async function processoEhAdministrativo(tarefa: any, cookie: string):Promise<boolean>{
    const objectGetArvoreDocumento: GetArvoreDocumentoDTO = { nup: tarefa.pasta.NUP, chave: tarefa.pasta.chaveAcesso, cookie, tarefa_id: tarefa.id }
    let arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[] = await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento);
    if(arrayDeDocumentos.length > 5){
        return false;
    }else{
        return true;
    }
    
}