
import { GetTarefaController } from './GetTarefaController';
import { GetTarefaUseCase } from './GetTarefaUseCase';
import { GetTarefaFacade } from './facades/GetTarefaFacade';
import { RequestGetTarefa } from './operations/request/RequestGetTarefa';

const requestGetTarefa = new RequestGetTarefa();
const getTarefaUseCase = new GetTarefaUseCase(requestGetTarefa);
const getTarefaController = new GetTarefaController(getTarefaUseCase);
const getTarefaFacade = new GetTarefaFacade();

export { getTarefaUseCase, getTarefaController, getTarefaFacade };
