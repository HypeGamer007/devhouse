import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { db } from '@/lib/db';
import Link from 'next/link';

const EventForm: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const newEvent = await db.event.create({ data });
    router.push(`/events/${newEvent.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Event Name" required />
      <select {...register('game')} required>
        {/* Populate this select with options for games */}
        <option value="game1">Game 1</option>
        <option value="game2">Game 2</option>
        {/* Add more game options as needed */}
      </select>
      <select {...register('eventType')} required>
        <option value="tournament">Tournament</option>
        <option value="league">League</option>
        <option value="scrim">Scrim</option>
        <option value="headToHead">Head to Head</option>
        <option value="casual">Casual</option>
        {/* Add more event types as needed */}
      </select>
      <input type="date" {...register('startDate')} placeholder="Start Date" required />
      <input type="date" {...register('endDate')} placeholder="End Date" required />
      <textarea {...register('description')} placeholder="Event Description" />
      <label>
        Event Management Type:
        <select {...register('managementType')} required>
          <option value="manual">Manual</option>
          <option value="automated">Automated</option>
        </select>
      </label>
      {/* Add more fields as necessary */}
      <button type="submit">Save Event</button>
      {router.query.eventId && (
        <Link href={`/events/edit/${router.query.eventId}`}>
          <a>Edit Event</a>
        </Link>
      )}
      {/* Conditional rendering based on user roles and IDs has been removed due to undefined variables */}
    </form>
  );
};

export default EventForm;
