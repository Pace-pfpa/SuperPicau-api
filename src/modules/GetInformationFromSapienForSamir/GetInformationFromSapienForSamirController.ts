import { Request, Response } from 'express';
import { IGetInformationsFromSapiensDTO } from '../../DTO/GetInformationsFromSapiensDTO';
import { GetInformationFromSapienForSamirUseCase } from './GetInformationFromSapienForSamirUseCase';

export class GetInformationFromSapienForSamirController {
    constructor(private getInformationFromSapienForSamirUseCase: GetInformationFromSapienForSamirUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const data: IGetInformationsFromSapiensDTO = request.body;
        console.log("CALL HERE")
        return new Promise((resolve, reject) => {
            setTimeout( async() => {
                try {
                    const result = await this.getInformationFromSapienForSamirUseCase.execute(data);
                    resolve(response.status(200).json(result))
                } catch (error) {
                    return response.status(400).json({
                        message: error.message || "Unexpected error"
                    });
                }

            }, 5000)
        })
    }
}

