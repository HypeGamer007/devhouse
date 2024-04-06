import React from 'react'
import { db } from '@/lib/db'

interface EventDetailPageProps {
  params: {
    eventId: string;
  };
}

const EventDetailPage: React.FC<EventDetailPageProps> = async ({ params }) => {
  const event = await db.event.findUnique({
    where: { id: params.eventId },
  })
  return (
    <div>
      {/* Display event details */}
      <button>Sign Up</button>
      <button>Invite</button>
      <button>Create Team</button>
    </div>
  )
}

export default EventDetailPage