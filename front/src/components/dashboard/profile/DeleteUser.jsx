/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { buttonLoader } from '@/components/ui/button-label';
import showToast from '@/services/toast';
import { customFetch } from '@/utils/fetch/axios';
import { logout } from '@/utils/redux/user';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DeleteUser({ id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await customFetch.delete(`/user/${id}`);
    },
    onSuccess: () => {
      navigate('/');
      showToast('Account Deleted Successfully');
      dispatch(logout());
    },
    onError: () => {
      showToast('error', 'error');
    },
  });

  return (
    <Button onClick={mutate} variant="destructive" disabled={isPending}>
      {buttonLoader(isPending, 'Delete Account')}
    </Button>
  );
}

export default DeleteUser;
