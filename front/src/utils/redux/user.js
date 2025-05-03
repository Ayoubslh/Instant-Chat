import { createSlice } from '@reduxjs/toolkit';

// Default initial data if Local Storage is empty
const initialData = {
  data: undefined,
};

const getDataFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || initialData;
  } catch (err) {
    console.error('Failed to parse Local Storage data:', err);
    return initialData;
  }
};

const initialState = getDataFromLocalStorage();

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.data = action.payload.data;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: state => {
      state.data = undefined;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = user.actions;
export default user.reducer;
