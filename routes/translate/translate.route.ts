import express from 'express';
import { validateTranslateDto } from './application/validators/translate-dto.validator';
import { translateService } from '../../services/translate.service';
import { databaseService } from '../../database/database.service';
import { HistoryModel } from '../history/infastructure/history.model';
import { TranslateDto } from './application/dto/translate.dto';

export const translateRouter = express.Router();

translateRouter.post('/', async(req, res) => {
  let dto: TranslateDto;
  const uuid = req.header('uuid') as string;

  try {
    dto = validateTranslateDto(req.body);
  }
  catch (err) {
    res.status(400).send((err as Error).message);
    return;
  }

  try {
    const result = await translateService.translate(dto.text, dto.originalLanguage, dto.translateLanguage);

    if(!result) {
      res.status(404).json(JSON.stringify('Переклад не знайдено'));
      return;
    }

    await databaseService.addItem(
      'history',
      {
        date: new Date(),
        userUUID: uuid,
        originalText: dto.text,
        translatedText: result,
        translatedLanguage: dto.translateLanguage,
        originalLanguage: dto.originalLanguage
      } satisfies Omit<HistoryModel, 'id'>);

    res.status(200).json(JSON.stringify(result));
  }
  catch (err) {
    res.status(500).json(JSON.stringify('Невідома помилка. спробуйте пізніше'));
  }
})