import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { validateToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();



// Get all links
router.get('/', async (req: Request, res: Response) => {
  try {

    const links = await prisma.dynamicLink.findMany();

    return res.status(200).json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', validateToken, async (req: Request, res: Response) => {
    try {
      const linkId = req.body.id;
  
      const existingLink = await prisma.dynamicLink.findUnique({
        where: { id: linkId },
      });
  
      if (existingLink) {
        return res.status(400).json({ error: 'Link with the same id already exists' });
      }
  
      const newLink = {
        id: linkId,
        target: req.body.target,
      };
  
      await prisma.dynamicLink.create({ data: newLink });
  
      return res.status(201).json({ message: 'Link created successfully' });
    } catch (error) {
      console.error('Error creating link:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

router.put('/:id', validateToken, async (req: Request, res: Response) => {
  try {
    

    const linkId = req.params.id;
    const updatedLink = {
      target: req.body.target,
    };

    await prisma.dynamicLink.update({
      where: { id: linkId },
      data: updatedLink,
    });

    return res.status(200).json({ message: 'Link updated successfully' });
  } catch (error) {
    console.error('Error updating link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', validateToken, async (req: Request, res: Response) => {
  try {

    const linkId = req.params.id;

    await prisma.dynamicLink.delete({ where: { id: linkId } });

    return res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const linkId = req.params.id;

    const link = await prisma.dynamicLink.findUnique({ where: { id: linkId } });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.status(307).redirect(link.target);
  } catch (error) {
    console.error('Error redirecting to link target:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
