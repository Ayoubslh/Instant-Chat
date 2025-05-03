// route
import { useNavigate } from 'react-router-dom';
// redux
import { useDispatch } from 'react-redux';
import { login } from '@/utils/redux/user';
// fetch
import { customFetch } from '@/utils/fetch/axios';
import { useMutation } from '@tanstack/react-query';
//toast
import showToast from '@/services/toast';

function useAuthMutation(
  url,
  successMessage = 'Operation successful',
  errorMessage = 'An error occurred'
) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async formData => {
      const response = await customFetch.post(`/auth/${url}`, formData);
      return response.data.data;
    },
    onSuccess: data => {
      navigate('/');
      dispatch(login({ data: data }));
      showToast(successMessage);
    },
    onError: () => {
      showToast(errorMessage, 'error');
    },
  });

  return mutation;
}

export { useAuthMutation };
