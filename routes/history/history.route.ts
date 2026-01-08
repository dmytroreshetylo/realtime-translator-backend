import express from 'express';
import { validatePaginatedList } from '../../shared/validators/paginated-list.validator';
import { HistoryModel } from './infastructure/history.model';
import { PaginatedListModel } from '../../shared/models/paginated-list.model';
import { historyService } from './infastructure/history.service';

export const historyRouter = express.Router();

historyRouter.post('/list', async(req, res) => {
  let dto: PaginatedListModel;
  const uuid = req.header('uuid') as string;

  try {
    dto = validatePaginatedList(req.body);
  }
  catch (error) {
    res.status(400).json(JSON.stringify((error as Error).message));
    return;
  }

  try {

    const result = await historyService.getPaginatedList<HistoryModel>(
      'history',
      dto.from,
      dto.to,
      { userUUID: uuid } satisfies Partial<HistoryModel>
    );

    res.status(200).json(JSON.stringify(result));
  }
  catch (error) {
    res.status(500).json(JSON.stringify('Невідома помилка. спробуйте пізніше'));
  }
});

historyRouter.get('/most-popular-original-language', async (req, res) => {
  const uuid = req.header('uuid') as string;

  try {
    const result = await historyService.getMostPopularOriginalLanguageByUserUUID(uuid);
    res.status(200).json(JSON.stringify(result));
  } catch (error) {
    res.status(500).json(JSON.stringify('Невідома помилка. спробуйте пізніше'));
  }
});
