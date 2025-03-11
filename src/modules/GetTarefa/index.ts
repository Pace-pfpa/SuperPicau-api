
import { GetTarefaController } from './GetTarefaController';
import { TarefaService } from './TarefaService';
import { GetTarefaUseCase } from './GetTarefaUseCase';
import { GetTarefaFacade } from './facades/GetTarefaFacade';
import { RequestGetTarefa } from './operations/request/RequestGetTarefa';

const requestGetTarefa = new RequestGetTarefa();
const getTarefaUseCase = new GetTarefaUseCase(requestGetTarefa);
const getTarefaController = new GetTarefaController(getTarefaUseCase);
const getTarefaFacade = new GetTarefaFacade();

const tarefaService = new TarefaService();

export { getTarefaUseCase, getTarefaController, getTarefaFacade };
