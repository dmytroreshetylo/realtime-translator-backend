import express from 'express';
import bodyParser from 'body-parser';
import { historyRouter } from './routes/history/history.route';
import { translateRouter } from './routes/translate/translate.route';

export const app = express();

const port = 3000;

app.use(bodyParser.json());

app.use('history', historyRouter);
app.use('translate', translateRouter);

export const server = app.listen(port, () => {
  console.log(`Сервер запустився за порту ${port}`);
});