// for typeorm
import 'reflect-metadata';
// import postgrees connection
import '@shared/container';
import '@shared/infra/typeorm';

import express from 'express';
import errorCatcher from '@shared/middlewares/errorCatcher';
import routes from '@shared/infra/http/routes';

import cors from 'cors';

import 'express-async-errors';

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);
app.use(errorCatcher);
app.listen(3003, () => {
    console.log('🚀 Server started at port 3003! 🌟');
});
