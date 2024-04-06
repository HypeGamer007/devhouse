import React from 'react'
import { useForm } from 'react-hook-form'
import { db } from '@/lib/db'

const EventForm = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    const newEvent = await db.event.create({ data })
    // Redirect to the new event's detail page
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields for event details */}
      <button type="submit">Save Event</button>
    </form>
  )
}

export default EventForm