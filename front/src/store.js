import { configureStore } from '@reduxjs/toolkit';
// slices
import user from '@/utils/redux/user';

export const store = configureStore({
  reducer: {
    user: user,
  },
});
