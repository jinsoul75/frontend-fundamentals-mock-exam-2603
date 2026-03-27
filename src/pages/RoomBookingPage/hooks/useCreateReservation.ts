import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';

export function useCreateReservation() {
  const queryClient = useQueryClient();

  const createReservationMutation = useMutation(
    (data: { roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) =>
      createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
        queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      },
    }
  );

  return { createReservationMutation };
}
