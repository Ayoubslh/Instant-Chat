import { createSlice } from '@reduxjs/toolkit';

// Default initial data if Local Storage is empty
const initialData = {};

const getDataFromLocalStorage = () => {
  try {
    // Replace 'yourDataKey' with the key name used in Local Storage
    return JSON.parse(localStorage.getItem('yourDataKey')) || initialData;
  } catch (err) {
    console.error('Failed to parse Local Storage data:', err);
    return initialData;
  }
};

// Initial state for the slice
const initialState = {
  // Replace 'data' with your desired state property name
  data: getDataFromLocalStorage(),
};

const data = createSlice({
  // Replace 'yourSliceName' with a descriptive name for your slice
  name: 'yourSliceName',
  initialState,
  reducers: {
    // Add your actions here
    setData: (state, action) => {
      state.data = action.payload;
      localStorage.setItem('yourDataKey', JSON.stringify(action.payload));
    },
  },
});

// Export the actions created by the slice
export const { setData } = data.actions;

export default data.reducer;