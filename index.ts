import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const jwtSecret = process.env.SECRET_KEY || ""


// ... Other imports and setup ...

app.post('/setstatus', async (req: Request, res: Response) => {
    try {
      const authorizationHeader = req.headers.authorization;
      
      if (!authorizationHeader) {
        return res.status(401).json({ error: 'Unauthorized: Missing authorization header' });
      }
  
      const tokenParts = authorizationHeader.split(' ');
      
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Unauthorized: Invalid authorization header format' });
      }
  
      const token = tokenParts[1];
  
      const decodedToken = jwt.verify(token, jwtSecret);
      const role = (decodedToken as { role: string }).role;
  
      if (!role.includes('Admin')) {
          return res.status(403).json({ error: 'Unauthorized: Only Admins can change logostatus' });
      }
  
      const newStatus = req.body.newStatus;
      const logoStatus = newStatus 
  
      await prisma.lauchStatus.upsert({
        where: { id: 1 },
        update: { logoStatus },
        create: { id: 1, logoStatus },
      });
  
      return res.status(201).json({ message: 'Logo status updated successfully' });
    } catch (error) {
      console.error('Error setting logo status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // ... Rest of the code ...
  
app.get('/getstatus', async (req: Request, res: Response) => {
  try {
    const logoStatus = await prisma.lauchStatus.findUnique({ where: { id: 1 } });

    if (!logoStatus) {
      return res.status(404).json({ error: 'Logo status not found' });
    }

    return res.status(200).json({ logoStatus });
  } catch (error) {
    console.error('Error fetching logo status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.listen(4000, () => {
  console.log(`Listening on port ${4000}`);
});
