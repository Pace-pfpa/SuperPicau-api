import { GetInformationFromSapiensForPicaPauControllerRefactor } from './GetInformationFromSapiensForPicaPauControllerRefactor'; 
import { GetInformationFromSapiensForPicaPauUseCaseRefactor } from './GetInformationFromSapiensForPicaPauUseCaseRefactor';

const getInformationFromSapiensForPicaPauUseCaseRefactor = new GetInformationFromSapiensForPicaPauUseCaseRefactor();
const getInformationFromSapiensForPicaPauControllerRefactor = new GetInformationFromSapiensForPicaPauControllerRefactor(getInformationFromSapiensForPicaPauUseCaseRefactor);

export { getInformationFromSapiensForPicaPauUseCaseRefactor, getInformationFromSapiensForPicaPauControllerRefactor };