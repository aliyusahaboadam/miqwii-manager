import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/result`;

// ---------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------

/**
 * Fetch the release list for a class + session.
 * Returns rows: { enrollmentId, studentId, regNo, firstname, surname,
 *                 lastname, fullName, classId, className, section,
 *                 academicSessionId, session, term, released, updatedAt }
 */
export const getReleaseList = createAsyncThunk(
  'result/getReleaseList',
  async ({ classId, sessionId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        `${BASE_URL}/release-list?classId=${classId}&sessionId=${sessionId}`,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

/**
 * Bulk flip the release flag on a set of enrollment IDs.
 */
export const updateReleased = createAsyncThunk(
  'result/updateReleased',
  async ({ enrollmentIds, released }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `${BASE_URL}/release-update`,
        { enrollmentIds, released },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data, enrollmentIds, released };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// ---------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------

const resultSlice = createSlice({
  name: 'result',
  initialState: {
    releaseList: [],
    fetchingStatus: 'idle',
    updatingStatus: 'idle',
    error: null,
  },
  reducers: {
    clearReleaseList(state) {
      state.releaseList = [];
      state.fetchingStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ---- getReleaseList ----
      .addCase(getReleaseList.pending, (state) => {
        state.fetchingStatus = 'loading';
        state.error = null;
      })
      .addCase(getReleaseList.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.releaseList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getReleaseList.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload?.message || 'Failed to fetch release list';
        state.releaseList = [];
      })

      // ---- updateReleased ----
      .addCase(updateReleased.pending, (state) => {
        state.updatingStatus = 'loading';
        state.error = null;
      })
      .addCase(updateReleased.fulfilled, (state, action) => {
        state.updatingStatus = 'succeeded';
        const { enrollmentIds, released } = action.payload;

        const idSet = new Set(enrollmentIds.map(Number));
        state.releaseList = state.releaseList.map((row) =>
          idSet.has(Number(row.enrollmentId)) ? { ...row, released } : row
        );
      })
      .addCase(updateReleased.rejected, (state, action) => {
        state.updatingStatus = 'failed';
        state.error = action.payload?.message || 'Failed to update release status';
      });
  },
});

export const { clearReleaseList } = resultSlice.actions;
export default resultSlice.reducer;