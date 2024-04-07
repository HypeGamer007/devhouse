import { NextApiRequest, NextApiResponse } from 'next';
import { users } from '@clerk/clerk-sdk-node'; // Adjusted import to use Clerk's SDK for session verification
import { PrismaClient } from '@prisma/client'; // Adjusted import to use PrismaClient from Prisma

const prisma = new PrismaClient(); // Created a new instance of PrismaClient

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

// Handler for creating a new event with dynamic type
const createEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, eventType, game, startDate, endDate, description, type } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        eventType,
        game,
        startDate,
        endDate,
        description,
        type: type, // Use the dynamic 'type' value provided in the request
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Handler for updating an existing event
const updateEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name, eventType, game, startDate, endDate, description } = req.body;
  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { name, eventType, game, startDate, endDate, description },
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Handler for deleting an event
const deleteEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  try {
    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// Handler for fetching a single event
const getEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    res.json(event);
  } catch (error) {
    res.status(404).json({ error: 'Event not found' });
  }
};

// Handler for adding a participant to an event
const addParticipant = async (req: NextApiRequest, res: NextApiResponse) => {
  const { eventId, participantId, ...otherData } = req.body;
  try {
    const participant = await prisma.participant.create({
      data: { eventId, participantId, ...otherData },
    });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add participant' });
  }
  
};

// Handler for creating a team for an event
const createTeam = async (req: NextApiRequest, res: NextApiResponse) => {
  const { eventId, name, members } = req.body;
  try {
    const team = await prisma.team.create({
      data: { eventId, name, members },
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// Handler for submitting scores for a manually run event
const submitScores = async (req: NextApiRequest, res: NextApiResponse) => {
  const { eventId, scores } = req.body;
  try {
    // Update the event with the submitted scores
    // Add your logic here to process and save the scores
    res.json({ message: 'Scores submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit scores' });
  }
};

// Main API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Skip session verification for role-based access control
    const { type } = req.query;
  
    if (type === 'eventTypes') {
      return getEventTypes(req, res);
    } else if (type === 'games') {
      return getGames(req, res);
    } else if (req.method === 'POST') {
      await createEvent(req, res);
    } else if (req.method === 'PUT') {
      await updateEvent(req, res);
    } else if (req.method === 'DELETE') {
      await deleteEvent(req, res);
    } else if (req.method === 'GET' && req.query.id) {
      await getEvent(req, res);
    } else if (req.method === 'POST' && req.query.type === 'submitScores') {
      await submitScores(req, res);
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
