import { TranslateDto } from '../dto/translate.dto';

export function validateTranslateDto(body: any): TranslateDto {
  if (!body || typeof body !== 'object') {
    throw Error('Некоректний формат даних');
  }

  const requiredFields = [
    'text',
    'originalLanguage',
    'translateLanguage'
  ];

  const hasAllFields = requiredFields.every(field => field in body);

  if (!hasAllFields) {
    throw Error('Некоректний формат даних');
  }

  const allStrings =
    typeof body['text'] === 'string' &&
    typeof body['originalLanguage'] === 'string' &&
    typeof body['translateLanguage'] === 'string';

  if (!allStrings) {
    throw Error('Некоректний формат даних');
  }

  if (
    !body['text'].trim() ||
    !body['originalLanguage'].trim() ||
    !body['translateLanguage'].trim()
  ) {
    throw Error('Поля не можуть бути порожніми');
  }

  if (body['originalLanguage'] === body['translateLanguage']) {
    throw Error('Мови перекладу не можуть бути однаковими');
  }

  return body as TranslateDto;
}
