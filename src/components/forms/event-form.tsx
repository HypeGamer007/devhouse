import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { db } from '@/lib/db';

const EventForm: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const newEvent = await db.event.create({ data });
    router.push(`/events/${newEvent.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields for event details */}
      <button type="submit">Save Event</button>
    </form>
  );
};

export default EventForm;
