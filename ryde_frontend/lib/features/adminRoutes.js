import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axios';






// router.get(
//   "/dashboardDataBrief",
//   authMiddleware.authAdmin,
//   dashboardController.dashboardDataBrief
// );

export const fetchDashboardDataBrief = createAsyncThunk(
  'admin/fetchDashboardDataBrief',
  async (token, thunkAPI) => {
    try {
      const response = await api.get(`/dashboardDataBrief`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

