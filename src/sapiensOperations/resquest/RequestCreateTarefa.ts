export class RequestCreateTarefa{
    async execute(pasta_id: number, pessoa_id: number){
        

        const response = {
            "action": "SapiensAdministrativo_Interessado",
            "method": "createInteressado",
            "data": [
              {
                "criadoEm": null,
                "apagadoEm": null,
                "atualizadoEm": null,
                "criadoPor_id": "",
                "atualizadoPor_id": "",
                "cargoInteressado": "",
                "modalidadeInteressado_id": 10,
                "pasta_id": `${pasta_id}`,
                "pessoa_id": `${pessoa_id}`
              }
            ],
            "tid": 30,
            "type": "rpc"
          }


          return response;

    }
}
//envolvidos cadastrados