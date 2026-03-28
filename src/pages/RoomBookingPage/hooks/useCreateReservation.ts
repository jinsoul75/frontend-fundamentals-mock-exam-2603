import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Reservation } from '_tosslib/server/types';
import axios from 'axios';
import { createReservation } from 'pages/remotes';

export function useCreateReservation({ onSuccess, onError }: {
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const queryClient = useQueryClient();

  const createReservationMutation = useMutation(
    (data: Omit<Reservation, 'id'>) => createReservation(data),
    {
      onSuccess: (result, variables) => {
        queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
        queryClient.invalidateQueries({ queryKey: ['myReservations'] });
        if ('ok' in result && result.ok) {
          onSuccess();
          return;
        }
        onError(result.message ?? '예약에 실패했습니다.');
      },
      onError: (err) => {
        let serverMessage = '예약에 실패했습니다.';
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as { message?: string } | undefined;
          serverMessage = data?.message ?? serverMessage;
        }
        onError(serverMessage);
      },
    }
  );

  return { createReservationMutation };
}
