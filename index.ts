import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import launchRoutes from './routes/launchRoute';
import dynamicLinkRoutes from './routes/linkRoute';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.get('/ping', (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: 'pong', status: 'OK' });
});

// Launch routes
app.use('/launch', launchRoutes);

// Dynamic Link routes
app.use('/links', dynamicLinkRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.listen(4000, () => {
  console.log(`Listening on port ${4000}`);
});
