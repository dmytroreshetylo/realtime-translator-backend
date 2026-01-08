import { HistoryModel } from '../../infastructure/history.model';

export type CreateHistoryDto = Omit<HistoryModel, 'id' | 'date' | 'userUUID'>;