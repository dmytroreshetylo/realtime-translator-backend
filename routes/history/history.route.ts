import express from 'express';
import { validatePaginatedList } from '../../shared/validators/paginated-list.validator';
import { validateCreateHistoryDto } from './application/validators/create-history-dto.validator';
import { databaseService } from '../../database/database.service';
import { HistoryModel } from './infastructure/history.model';

export const historyRouter = express.Router();

historyRouter.use((req, res, next) => {
  const uuid = req.header('uuid');
  if(!uuid) {
    res.status(404).send('Не знайдено');
  }

  next();
})

historyRouter.get('/list', async(req, res) => {
  try {
    const uuid = req.header('uuid') as string;

    const dto = validatePaginatedList(req.body);

    const result = await databaseService.getPaginatedList<HistoryModel>(
      'history',
      dto.from,
      dto.to,
      { userUUID: uuid } satisfies Partial<HistoryModel>
    );

    res.status(200).json(result);
  }
  catch (error) {
    res.status(400).json((error as Error).message);
  }
});

historyRouter.post('/', async (req, res) => {
  try {
    const uuid = req.header('uuid') as string;

    const dto = validateCreateHistoryDto(req.body);

    await databaseService.addItem('history', { date: new Date(), userUUID: uuid, ...dto } satisfies Omit<HistoryModel, 'id'>);

    res.status(201).json(true);
  }
  catch (error) {
    res.status(400).json((error as Error).message);
  }
});