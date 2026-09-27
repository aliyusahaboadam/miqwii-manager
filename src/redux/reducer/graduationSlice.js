// File: src/redux/reducer/graduationSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/graduation`;

// ===================================================================
// THUNKS
// ===================================================================

export const previewGraduation = createAsyncThunk(
  'graduation/preview',
  async (requestData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + '/preview',
        requestData,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const executeGraduation = createAsyncThunk(
  'graduation/execute',
  async (requestData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + '/execute',
        requestData,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getGraduationHistory = createAsyncThunk(
  'graduation/history',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/history', {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getGraduationBatchDetail = createAsyncThunk(
  'graduation/batchDetail',
  async (batchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/history/${batchId}`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getGraduationBatchEnrollments = createAsyncThunk(
  'graduation/batchEnrollments',
  async (batchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/history/${batchId}/enrollments`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getGraduatedStudents = createAsyncThunk(
  'graduation/graduatedStudents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/graduated-students', {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// NOTE: undoGraduation thunk intentionally removed.
// Graduation is terminal — see PromotionServiceImpl.undoBatch.

// ===================================================================
// SLICE
// ===================================================================

const graduationSlice = createSlice({
  name: 'graduation',
  initialState: {
    preview: null,
    lastResult: null,
    history: [],
    batchDetail: null,
    batchEnrollments: [],
    graduatedStudents: [],

    previewingStatus: 'idle',
    executingStatus: 'idle',
    fetchingStatus: 'idle',

    error: null,
  },
  reducers: {
    clearGraduationPreview(state) {
      state.preview = null;
    },
    clearGraduationResult(state) {
      state.lastResult = null;
    },
    clearGraduationError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(previewGraduation.pending, (state) => {
        state.previewingStatus = 'loading';
        state.error = null;
      })
      .addCase(previewGraduation.fulfilled, (state, action) => {
        state.previewingStatus = 'succeeded';
        state.preview = action.payload;
      })
      .addCase(previewGraduation.rejected, (state, action) => {
        state.previewingStatus = 'failed';
        state.error = action.payload?.message || 'Preview failed';
      })

      .addCase(executeGraduation.pending, (state) => {
        state.executingStatus = 'loading';
        state.error = null;
      })
      .addCase(executeGraduation.fulfilled, (state, action) => {
        state.executingStatus = 'succeeded';
        state.lastResult = action.payload;
        if (action.payload?.batchId) {
          state.history.unshift(action.payload);
        }
      })
      .addCase(executeGraduation.rejected, (state, action) => {
        state.executingStatus = 'failed';
        state.error = action.payload?.message || 'Execute failed';
      })

      .addCase(getGraduationHistory.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getGraduationHistory.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.history = action.payload || [];
      })
      .addCase(getGraduationHistory.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      .addCase(getGraduationBatchDetail.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getGraduationBatchDetail.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.batchDetail = action.payload;
      })
      .addCase(getGraduationBatchDetail.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      .addCase(getGraduationBatchEnrollments.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getGraduationBatchEnrollments.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.batchEnrollments = action.payload || [];
      })
      .addCase(getGraduationBatchEnrollments.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      .addCase(getGraduatedStudents.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getGraduatedStudents.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.graduatedStudents = action.payload || [];
      })
      .addCase(getGraduatedStudents.rejected, (state) => {
        state.fetchingStatus = 'failed';
      });
  },
});

export const {
  clearGraduationPreview,
  clearGraduationResult,
  clearGraduationError,
} = graduationSlice.actions;

export default graduationSlice.reducer;