import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '@/lib/db';
import { useRouter } from 'next/router';

interface TeamFormProps {
  eventId: string;
  teamId?: string; // Optional for editing existing teams
}

const TeamForm: React.FC<TeamFormProps> = ({ eventId, teamId }) => {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamId) {
      // If teamId is provided, fetch the existing team data to populate the form
      setLoading(true);
      db.team.findUnique({ where: { id: teamId } })
        .then(team => {
          if (team) {
            setValue('name', team.name);
            // Set other values as needed
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [teamId, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (teamId) {
        // Update existing team
        await db.team.update({
          where: { id: teamId },
          data: { ...data, eventId },
        });
      } else {
        // Create new team
        await db.team.create({
          data: { ...data, eventId },
        });
      }
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error("Failed to save the team", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="teamName">Team Name</label>
        <input id="teamName" name="teamName" type="text" {...register('teamName', { required: true })} />
      </div>
      {/* Add more fields as necessary */}
      <button type="submit" disabled={loading}>
        {teamId ? 'Update Team' : 'Create Team'}
      </button>
    </form>
  );
};

export default TeamForm;
