import { useSelector } from 'react-redux';

export function useUser() {
  const { data } = useSelector(state => state.user);

  if (data) return { data };

  return { data: undefined };
}
