import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { historyRouter } from './src/routes/history/history.route';
import { translateRouter } from './src/routes/translate/translate.route';
import { config } from './src/config/config';

export const app = express();

const port = 3000;

app.use(cors({ origin: config.origin }));
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const uuid = req.header('uuid');
  if(!uuid) {
    res.status(404).json({ message: 'Ідентифікаційний код не знайдено' });
    return;
  }

  next();
});

app.use('/history', historyRouter);
app.use('/translate', translateRouter);

export const server = app.listen(port, () => {
  console.log(`Сервер запустився за порту ${port}`);
  console.log(`Файл бази даних: ${config.dbFile}`);
});
