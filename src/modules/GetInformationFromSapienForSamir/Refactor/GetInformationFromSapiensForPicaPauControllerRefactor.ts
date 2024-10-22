import { Request, Response } from 'express';
import { IGetInformationsFromSapiensDTO } from '../../../DTO/GetInformationsFromSapiensDTO';
import { GetInformationFromSapiensForPicaPauUseCaseRefactor } from './GetInformationFromSapiensForPicaPauUseCaseRefactor';
import { BuscarImpedimentosUseCase } from '../BuscarImpedimentos/BuscarImpedimentosUseCase';
import { finalizarTriagem } from './utils/finalizarTriagem';

export class GetInformationFromSapiensForPicaPauControllerRefactor {

    constructor(
        private getInformationFromSapiensForPicaPauUseCaseRefactor: GetInformationFromSapiensForPicaPauUseCaseRefactor,
        private buscarImpedimentosUseCase: BuscarImpedimentosUseCase
    ) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const data: IGetInformationsFromSapiensDTO = request.body;
        console.log("CALL HERE REFACTOR")
        return new Promise((resolve, reject) => {
            setTimeout( async() => {
                try {
                    const result = await this.getInformationFromSapiensForPicaPauUseCaseRefactor.execute(data);

                    if ('warning' in result) {
                        return resolve(response.status(200).json(result))
                    }

                    let impedimentos: string[];

                    if (result[1] === 'LOAS') {
                        impedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentosLOAS(result[0]);
                    } else {
                        impedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentos(result[0])
                    }

                    const processo = await finalizarTriagem(impedimentos, result[0]);

                    resolve(response.status(200).json(processo));

                } catch (error) {
                    console.log("Farfan", error)
                    return response.status(400).json({
                        message: error.message || "Unexpected error"
                    });
                }

            }, 5000)
        })
    }
}
