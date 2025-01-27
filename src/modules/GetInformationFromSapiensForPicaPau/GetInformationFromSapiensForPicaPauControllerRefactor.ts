import { Request, Response } from 'express';
import { GetInformationFromSapiensForPicaPauUseCaseRefactor } from './GetInformationFromSapiensForPicaPauUseCaseRefactor';
import { BuscarImpedimentosUseCase } from './BuscarImpedimentos/BuscarImpedimentosUseCase';
import { GetInformationsFromSapiensDTO } from '.';
import { IFinalizarTriagem, IResponseLabraAutorConjuge } from './dto';
import { finalizarTriagem } from './classes';

export class GetInformationFromSapiensForPicaPauControllerRefactor {

    constructor(
        private readonly getInformationFromSapiensForPicaPauUseCaseRefactor: GetInformationFromSapiensForPicaPauUseCaseRefactor,
        private readonly buscarImpedimentosUseCase: BuscarImpedimentosUseCase
    ) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const data: GetInformationsFromSapiensDTO = request.body;
        return new Promise((resolve, reject) => {
            setTimeout(async() => {
                try {
                    const result = await this.getInformationFromSapiensForPicaPauUseCaseRefactor.execute(data);

                    if ('warning' in result) {
                        return resolve(response.status(200).json({
                            resultadoTriagem: '2',
                            resposta: result
                        }))
                    }

                    let processo: IFinalizarTriagem;
                    let impedimentos: string[];

                    let impedimentosLabraRM: IResponseLabraAutorConjuge;

                    if (result[1] === 'LOAS') {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentosLOAS(result[0]);
                        impedimentos = buscaDeImpedimentos.impedimentos;
                        let impedimentosLabraLoas = buscaDeImpedimentos.objImpedimentosLabra;
                        let impedimentosDosprevLoas = buscaDeImpedimentos.objImpedimentos;

                        processo = await finalizarTriagem.loas(
                            impedimentos,
                            impedimentosLabraLoas,
                            impedimentosDosprevLoas,
                            result[0]
                        );
                        
                    } else if (result[0].tipo_triagem === 0) {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentosRural(result[0]);
                        impedimentos = buscaDeImpedimentos.impedimentos;
                        impedimentosLabraRM = buscaDeImpedimentos.objImpedimentosLabra;
                        let impedimentosDosprevRM = buscaDeImpedimentos.objImpedimentos;

                        processo = await finalizarTriagem.rural(
                            impedimentos,
                            impedimentosLabraRM,
                            impedimentosDosprevRM,
                            result[0]
                        );

                    } else {
                        const buscaDeImpedimentos = await this.buscarImpedimentosUseCase.procurarImpedimentosMaternidade(result[0])
                        impedimentos = buscaDeImpedimentos.impedimentos;
                        impedimentosLabraRM = buscaDeImpedimentos.objImpedimentosLabra;
                        let impedimentosDosprevRM = buscaDeImpedimentos.objImpedimentos;

                        processo = await finalizarTriagem.maternidade(
                            impedimentos,
                            impedimentosLabraRM,
                            impedimentosDosprevRM,
                            result[0]
                        );

                    }

                    resolve(response.status(200).json(processo));

                } catch (error) {
                    console.error("Farfan", error)
                    return response.status(400).json({
                        resultadoTriagem: '2',
                        resposta: error.message || "Erro inesperado durante a triagem."
                    });
                }
            }, 5000)
        })
    }
}
