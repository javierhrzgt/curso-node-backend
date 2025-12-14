import express from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import {
  logErrors,
  errorHandler,
  boomErrorHandler,
} from './middleware/error.handler.js';
import { el } from '@faker-js/faker';

const app = express();
const PORT = 3000;

app.use(express.json());

const whitelist = ['http://localhost:8080'];

const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido.'));
    }
  },
};

app.use(cors(options));

app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
