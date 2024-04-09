import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import InvitePlayerForm from '@/components/forms/invite-player-form';

interface EventTeamFormProps {
  eventId: string;
  teamId?: string; // Optional for editing existing teams
}

const EventTeamForm: React.FC<EventTeamFormProps> = ({ eventId, teamId }) => {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [playerEmail, setPlayerEmail] = useState('');
  
  const handleInvitePlayer = async (email: string) => {
    try {
      // Assuming invitePlayerApi is an async function that sends an invitation
      await invitePlayerApi({ teamId: teamId, email: email });
      console.log(`Inviting player with email: ${email}`);
    } catch (error) {
      console.error("Failed to invite player", error);
    }
  };

  const handleAddSelfToRoster = async () => {
    try {
      // Assuming addSelfToRosterApi is an async function that adds the creator to the roster
      await addSelfToRosterApi({ teamId: teamId, userEmail: currentUser.email });
      console.log('Adding creator to the team roster');
    } catch (error) {
      console.error("Failed to add creator to the team roster", error);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Assuming createOrUpdateTeam is an async function that creates or updates a team
      await createOrUpdateTeam({ teamId: teamId, name: data.teamName, eventId: eventId });
      console.log('Team saved successfully');
      // Redirect or perform further actions upon success
    } catch (error) {
      console.error("Failed to save the team", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="teamName">Team Name</label>
        <input id="teamName" name="teamName" type="text" {...register('teamName', { required: true })} />
      </div>
      
      {/* Invite Player Form */}
      <InvitePlayerForm onInvite={handleInvitePlayer} />
      
      {/* Button to add creator to team roster */}
      <button type="button" onClick={handleAddSelfToRoster}>
        Add Myself to Roster
      </button>
      
      <button type="submit" disabled={loading}>
        {teamId ? 'Update Team' : 'Create Team'}
      </button>
    </form>
  );
};

export default EventTeamForm;
