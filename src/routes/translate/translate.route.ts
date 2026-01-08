import express from 'express';
import { validateTranslateDto } from './application/validators/translate-dto.validator';
import { translateService } from '../../services/translate.service';
import { HistoryModel } from '../history/infastructure/history.model';
import { TranslateDto } from './application/dto/translate.dto';
import { historyService } from '../history/infastructure/history.service';

export const translateRouter = express.Router();

translateRouter.post('/', async(req, res) => {
  let dto: TranslateDto;
  const uuid = req.header('uuid') as string;

  try {
    dto = validateTranslateDto(req.body);
  }
  catch (err) {
    res.status(400).send({ message: (err as Error).message });
    return;
  }

  try {
    const result = await translateService.translate(dto.text, dto.originalLanguage, dto.translateLanguage);

    if(!result) {
      res.status(404).json({ message: 'Переклад не знайдено' });
      return;
    }

    await historyService.addItem(
      'history',
      {
        date: new Date(),
        userUUID: uuid,
        originalText: dto.text,
        translatedText: result,
        translatedLanguage: dto.translateLanguage,
        originalLanguage: dto.originalLanguage
      } satisfies Omit<HistoryModel, 'id'>);

    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).json({ message: 'Невідома помилка. спробуйте пізніше' });
  }
})