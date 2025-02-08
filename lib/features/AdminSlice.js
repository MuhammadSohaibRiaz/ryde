import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  token: null,
  role: null,
};

// async thunk for login admin

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.example.com/admin/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        return rejectWithValue(responseData);
      }

      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: {
    [loginAdmin.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
  },
});

export const { login, logout, setRole } = adminSlice.actions;

export default adminSlice.reducer;