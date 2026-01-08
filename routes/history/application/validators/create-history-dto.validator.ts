import { CreateHistoryDto } from '../dto/create-history.dto';

export function validateCreateHistoryDto(body: any): CreateHistoryDto {
  if (!body || typeof body !== 'object') {
    throw Error('Некоректний формат даних');
  }

  const requiredFields = [
    'originalText',
    'translatedText',
    'originalLanguage',
    'translatedLanguage'
  ];

  const hasAllFields = requiredFields.every(field => field in body);

  if (!hasAllFields) {
    throw Error('Некоректний формат даних');
  }

  const allStrings =
    typeof body['originalText'] === 'string' &&
    typeof body['translatedText'] === 'string' &&
    typeof body['originalLanguage'] === 'string' &&
    typeof body['translatedLanguage'] === 'string';

  if (!allStrings) {
    throw Error('Некоректний формат даних');
  }

  if (
    !body['originalText'].trim() ||
    !body['translatedText'].trim() ||
    !body['originalLanguage'].trim() ||
    !body['translatedLanguage'].trim()
  ) {
    throw Error('Поля не можуть бути порожніми');
  }

  return body as CreateHistoryDto;
}
