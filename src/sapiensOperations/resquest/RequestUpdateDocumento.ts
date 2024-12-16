import { IUpdateDocumento } from "../../modules/UpdateDocumento/dtos/IUpdateDocumento";

export class RequestUpdateDocumento {
    async execute(data: IUpdateDocumento): Promise<string> {
        const updateDocumento = `{
            "action":"SapiensAdministrativo_Documento",
            "method":"updateDocumento",
            "data":[
               {
                  "id": ${data.minuta_id},  
                  "numeroFolhas":3,
                  "dataHoraProducao":"",
                  "localProducao":"",
                  "vinculado":false,
                  "copia":false,
                  "observacao":"",
                  "autor":"${data.usuario_nome}",
                  "pasta_id":${data.pasta_id},
                  "redator":"${data.usuario_nome}",
                  "procedencia_id":"",
                  "tipoDocumento_id":${data.tipoDocumento_id},
                  "comunicacaoRemessa_id":"",
                  "setorOrigem_id":${data.usuario_setor},
                  "tarefaOrigem_id":${data.tarefa_id},
                  "visibilidadeRestrita":false,
                  "semEfeito":false,
                  "localizadorOriginal":"",
                  "minuta":true,
                  "outroNumero":"",
                  "criadoPor_id":"",
                  "origemDados_id":"",
                  "atualizadoPor_id":"",
                  "anexaCopia": [
                    ${data.dosprev_id}
                  ],
                  "descricaoOutros":"",
                  "anexaCopiaVinculados":true,
                  "parentId":null,
                  "leaf":false
               }
            ],
            "type":"rpc",
            "tid":${data.tid}
         }`
        
        return updateDocumento;
    }
}
