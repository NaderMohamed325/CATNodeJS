import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { setupSwagger } from './swagger';
import { errorHandler } from './utils/errorHandler';
import mongoose from 'mongoose';
import { authRouter } from './routes/authRoute';
//---------------------------------------------------------------------------//
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

mongoose.connect('mongodb://localhost:27017/E-Commerce').then(() => {
  console.log('DB connected');
});
//---------------------------------------------------------------------------//
const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(morgan('dev'));

// Swagger setup
setupSwagger(app);
app.use(authRouter);

app.use(errorHandler);

//---------------------------------------------------------------------------//
app.all('*', (_req, res: Response) => {
  res.status(404).send({ error: 'Not Found' });
});
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
