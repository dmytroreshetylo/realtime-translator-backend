import express from 'express';
import { validatePaginatedList } from '../../shared/validators/paginated-list.validator';
import { databaseService } from '../../database/database.service';
import { HistoryModel } from './infastructure/history.model';
import { PaginatedListModel } from '../../shared/models/paginated-list.model';

export const historyRouter = express.Router();

historyRouter.get('/list', async(req, res) => {
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

    const result = await databaseService.getPaginatedList<HistoryModel>(
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