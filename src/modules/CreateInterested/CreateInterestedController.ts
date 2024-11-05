import { Request, Response } from "express";
import { IinteressadosDTO } from "../../DTO/InteressadosDTO";
import { CreateInterestedUseCase } from "./CreateInterestedUseCase";


export class CreateInterestedController{
    constructor(private createInterestedUseCase: CreateInterestedUseCase){}


    async handle(req: Request, resp: Response){
        const data: IinteressadosDTO = req.body

        try{
            const created = await this.createInterestedUseCase.execute(data);
            console.log(created)

            resp.status(200).json(created);
        }catch(error){
            return resp.status(400).json({
                message: error.message || "Unexpected error"
            });


        }
    }
}