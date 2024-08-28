import { CreateInterestedController } from "./CreateInterestedController";
import { CreateInterestedUseCase } from "./CreateInterestedUseCase";

export const createInterestedUseCase = new CreateInterestedUseCase();

export const createInterestedController = new CreateInterestedController(createInterestedUseCase);