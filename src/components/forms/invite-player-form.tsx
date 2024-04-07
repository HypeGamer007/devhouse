import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useToast } from '@/components/ui/use-toast';

interface InvitePlayerFormProps {
  teamId: string;
}

interface InvitePlayerFormData {
  email: string;
}

const InvitePlayerForm: React.FC<InvitePlayerFormProps> = ({ teamId }) => {
  const { register, handleSubmit } = useForm<InvitePlayerFormData>({
    resolver: zodResolver(z.object({
      email: z.string().email({ message: "Invalid email format" }).nonempty({ message: "Email is required" }),
    })),
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: InvitePlayerFormData) => {
    setSubmitting(true);
    try {
      console.log(`Inviting player with email: ${data.email}`);
      toast({ title: 'Invitation sent successfully' });
    } catch (error) {
      console.error("Failed to send invitation", error);
      toast({ title: 'Failed to send invitation.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Player Email</label>
        <input id="email" type="email" {...register('email')} required />
      </div>
      <button type="submit" disabled={submitting}>
        Invite Player
      </button>
    </form>
  );
};

export default InvitePlayerForm;