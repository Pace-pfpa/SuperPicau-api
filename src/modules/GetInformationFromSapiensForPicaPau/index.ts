import { GetInformationFromSapiensForPicaPauControllerRefactor } from './GetInformationFromSapiensForPicaPauControllerRefactor'; 
import { GetInformationFromSapiensForPicaPauUseCaseRefactor } from './GetInformationFromSapiensForPicaPauUseCaseRefactor';
import { buscarImpedimentosUseCase } from './BuscarImpedimentos';

const getInformationFromSapiensForPicaPauUseCaseRefactor = new GetInformationFromSapiensForPicaPauUseCaseRefactor();
const getInformationFromSapiensForPicaPauControllerRefactor = new GetInformationFromSapiensForPicaPauControllerRefactor(getInformationFromSapiensForPicaPauUseCaseRefactor, buscarImpedimentosUseCase);

export { getInformationFromSapiensForPicaPauUseCaseRefactor, getInformationFromSapiensForPicaPauControllerRefactor };

export * from './dto/Triagem/interfaces/GetInformationFromSapiensDTO';