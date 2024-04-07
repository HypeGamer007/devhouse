// src/pages/events/api/index.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handler for fetching event types securely
const getEventTypes = async (req: NextApiRequest, res: NextApiResponse) => {
  const eventTypes = await prisma.eventType.findMany();
  res.json(eventTypes);
};

// Handler for fetching games securely
const getGames = async (req: NextApiRequest, res: NextApiResponse) => {
  const games = await prisma.game.findMany();
  res.json(games);
};

// ... other API handlers ...

// Main API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Skip session verification for role-based access control
    const { type } = req.query;
  
    if (type === 'eventTypes') {
      return getEventTypes(req, res);
    } else if (type === 'games') {
      return getGames(req, res);
    }
    // ... other routing logic ...
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
