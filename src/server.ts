// for typeorm
import 'reflect-metadata';
// import postgrees connection
import './database';

import express from 'express';
import errorCatcher from './middlewares/errorCatcher';
import routes from './routes';

import 'express-async-errors';

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorCatcher);
app.listen(3003, () => {
    console.log('Server started at port 3003!');
});
