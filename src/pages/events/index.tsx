import React from 'react'
import { db } from '@/lib/db'

const EventsPage = async () => {
  const events = await db.event.findMany()
  return (
    <div>
      {/* List events here */}
      <button>Create Event</button>
    </div>
  )
}

export default EventsPage