import { PaginatedListModel } from '../models/paginated-list.model';

export function validatePaginatedList(body: any): PaginatedListModel {
  if(!body || typeof body !== 'object') {
    throw Error('Некорректний формат даних');
  }

  const hasFromAndTo = 'from' in body && 'to' in body;

  if(!hasFromAndTo) {
    throw Error('Некорректний формат даних');
  }

  const bothIntegers = typeof body.from === 'number' && typeof body.to === 'number' && Number.isInteger(body.from) && Number.isInteger(body.to);

  if(!bothIntegers) {
    throw Error('Некорректний формат даних');
  }

  if(body.from > body.to) {
    throw Error('Початок не має бути більше або дорівнювати кінцю');
  }

  return body as PaginatedListModel;
}