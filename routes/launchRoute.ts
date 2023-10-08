import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { validateToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();
const jwtSecret = process.env.SECRET_KEY || "";





// Get launch status
router.get('/status', async (req: Request, res: Response) => {
  try {
    // Fetch launch status from the database
    const launchStatus = await prisma.launchStatus.findUnique({ where: { id: 1 } });

    if (!launchStatus) {
      return res.status(404).json({ error: 'Launch status not found' });
    }

    return res.status(200).json({ launchStatus });
  } catch (error) {
    console.error('Error fetching launch status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update website status (Admin role required)
router.post('/website',validateToken,  async (req: Request, res: Response) => {
  try {

    const newStatus = req.body.websiteStatus;
    const websiteStatus = newStatus;

    await prisma.launchStatus.upsert({
      where: { id: 1 },
      update: { websiteStatus },
      create: { id: 1, websiteStatus },
    });

    return res.status(201).json({ message: 'Website status updated successfully' });
  } catch (error) {
    console.error('Error setting website status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update mascot status (Admin role required)
router.post('/mascot', validateToken, async (req: Request, res: Response) => {
  try {
  
    const newStatus = req.body.mascotStatus;
    const mascotStatus = newStatus;

    await prisma.launchStatus.upsert({
      where: { id: 1 },
      update: { mascotStatus },
      create: { id: 1, mascotStatus },
    });

    return res.status(201).json({ message: 'Mascot status updated successfully' });
  } catch (error) {
    console.error('Error setting mascot status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
