import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express, { Request, Response } from 'express';
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


app.use('/:id', async (req: Request, res: Response) => {
  try {
    const linkId = req.params.id;

    const link = await prisma.dynamicLink.findUnique({ where: { id: linkId } });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.redirect(307,link.target);
  } catch (error) {
    console.error('Error redirecting to link target:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.listen(4000, () => {
  console.log(`Listening on port ${4000}`);
});
