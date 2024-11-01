import { Request, Response } from 'express';
import { IGetInformationsFromSapiensDTO } from '../../../DTO/GetInformationsFromSapiensDTO';
import { GetInformationFromSapiensForPicaPauUseCaseRefactor } from './GetInformationFromSapiensForPicaPauUseCaseRefactor';
import { BuscarImpedimentosUseCase } from '../BuscarImpedimentos/BuscarImpedimentosUseCase';
import { finalizarTriagem } from './utils/finalizarTriagem';
import { IResponseLabraAutorConjuge } from '../../../DTO/IResponseSislabra';

export class GetInformationFromSapiensForPicaPauControllerRefactor {

    constructor(
        private getInformationFromSapiensForPicaPauUseCaseRefactor: GetInformationFromSapiensForPicaPauUseCaseRefactor,
        private buscarImpedimentosUseCase: BuscarImpedimentosUseCase
    ) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const data: IGetInformationsFromSapiensDTO = request.body;
        console.log("CALL HERE REFACTOR")
        return new Promise((resolve, reject) => {
            setTimeout(async() => {
                try {
                    const result = await this.getInformationFromSapiensForPicaPauUseCaseRefactor.execute(data);

                    if ('warning' in result) {
                        return resolve(response.status(200).json(result))
                    }

                    let impedimentos: string[];
                    let impedimentosLabra: IResponseLabraAutorConjuge;

                    if (result[1] === 'LOAS') {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentosLOAS(result[0]);
                        impedimentos = buscaDeImpedimentos.impedimentos;
                    } else {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentos(result[0])
                        impedimentos = buscaDeImpedimentos.impedimentos;
                        impedimentosLabra = buscaDeImpedimentos.objImpedimentosLabra;
                    }

                    const processo = await finalizarTriagem(impedimentos, impedimentosLabra, result[0]);

                    resolve(response.status(200).json(processo));

                } catch (error) {
                    console.error("Farfan", error)
                    return response.status(400).json({
                        message: error.message || "Erro inesperado durante a triagem."
                    });
                }
            }, 5000)
        })
    }
}
