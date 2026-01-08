import express from 'express';
import { validateTranslateDto } from './application/validators/translate-dto.validator';
import { translateService } from '../../services/translate.service';

export const translateRouter = express.Router();

translateRouter.post('/', async(req, res) => {
  try {
    const dto = validateTranslateDto(req.body);

    const result = await translateService.translate(dto.text, dto.originalLanguage, dto.translateLanguage);

    res.status(200).send(result);
  }
  catch (err) {
    res.status(400).send((err as Error).message);
  }
})