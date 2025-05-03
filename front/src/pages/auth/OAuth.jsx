import { useQuery } from '@tanstack/react-query';
import Login from './Login';
import { customFetch } from '@/utils/fetch/axios';
import { useDispatch } from 'react-redux';
import { login } from '@/utils/redux/user';
import { useNavigate } from 'react-router-dom';
import showToast from '@/services/toast';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isError } = useQuery({
    queryKey: ['oauthUser'],
    queryFn: async () => {
      const res = await customFetch.get('/user/me');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) {
      showToast('Sorry, there was an error', 'error');
      navigate('/auth/sign-up');
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (data) {
      showToast('Welcome');
      navigate('/dashboard');
      setTimeout(() => {
        dispatch(login({ data }));
      }, 50);
    }
  }, [data, dispatch, navigate]);

  return (
    <>
      <div className="fixed flex items-center justify-center flex-col h-full w-full top-1/2 left-1/2 -translate-1/2 z-10 bg-black/40">
        <Loader className="animate-spin size-8" />
      </div>
      <Login />
    </>
  );
}

export default OAuth;
