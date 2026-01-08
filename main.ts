import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { historyRouter } from './routes/history/history.route';
import { translateRouter } from './routes/translate/translate.route';

export const app = express();

const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const uuid = req.header('uuid');
  if(!uuid) {
    res.status(404).json(JSON.stringify('Не знайдено'));
    return;
  }

  next();
});

app.use('/history', historyRouter);
app.use('/translate', translateRouter);

export const server = app.listen(port, () => {
  console.log(`Сервер запустився за порту ${port}`);
});