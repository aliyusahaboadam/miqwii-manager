// File: src/redux/reducer/attendanceSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/attendance`;

// =====================================================================
// FETCH WEEK — for the grid
// =====================================================================
export const fetchAttendanceWeek = createAsyncThunk(
  'attendance/fetchWeek',
  async ({ classId, weekStart }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/week`, {
        params: { classId, weekStart },
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// =====================================================================
// MARK WEEK — save a week's worth of marks
// =====================================================================
export const markAttendanceWeek = createAsyncThunk(
  'attendance/markWeek',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`${BASE_URL}/mark-week`, payload, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// =====================================================================
// FETCH RANGE — earliest/latest attendance date for a session
// Used by the export page to auto-fill the date range.
// =====================================================================
export const fetchAttendanceRange = createAsyncThunk(
  'attendance/fetchRange',
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/range`, {
        params: { sessionId },
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// =====================================================================
// EXPORT — returns a Blob the component triggers as a download
// =====================================================================
export const exportAttendance = createAsyncThunk(
  'attendance/export',
  async ({ sessionId, classId, from, to }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = { sessionId, from, to };
      if (classId) params.classId = classId;

      const response = await api.get(`${BASE_URL}/export`, {
        params,
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        responseType: 'blob',
      });
      return { blob: response.data, from, to };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Download failed' });
    }
  }
);

// =====================================================================
// SLICE
// =====================================================================
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    week: null,
    range: { from: null, to: null, hasData: false },
    fetchingStatus: 'idle',
    markingStatus: 'idle',
    rangeFetchingStatus: 'idle',
    exportingStatus: 'idle',
    error: null,
  },
  reducers: {
    clearWeek(state) {
      state.week = null;
    },
    clearRange(state) {
      state.range = { from: null, to: null, hasData: false };
    },
  },
  extraReducers: (builder) => {
    builder

      // ---- fetch week ----
      .addCase(fetchAttendanceWeek.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(fetchAttendanceWeek.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.week = action.payload;
      })
      .addCase(fetchAttendanceWeek.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      // ---- mark week ----
      .addCase(markAttendanceWeek.pending, (state) => {
        state.markingStatus = 'loading';
      })
      .addCase(markAttendanceWeek.fulfilled, (state) => {
        state.markingStatus = 'succeeded';
      })
      .addCase(markAttendanceWeek.rejected, (state) => {
        state.markingStatus = 'failed';
      })

      // ---- range ----
      .addCase(fetchAttendanceRange.pending, (state) => {
        state.rangeFetchingStatus = 'loading';
      })
      .addCase(fetchAttendanceRange.fulfilled, (state, action) => {
        state.rangeFetchingStatus = 'succeeded';
        state.range = action.payload;
      })
      .addCase(fetchAttendanceRange.rejected, (state) => {
        state.rangeFetchingStatus = 'failed';
      })

      // ---- export ----
      .addCase(exportAttendance.pending, (state) => {
        state.exportingStatus = 'loading';
      })
      .addCase(exportAttendance.fulfilled, (state) => {
        state.exportingStatus = 'succeeded';
      })
      .addCase(exportAttendance.rejected, (state) => {
        state.exportingStatus = 'failed';
      });
  },
});

export const { clearWeek, clearRange } = attendanceSlice.actions;
export default attendanceSlice.reducer;