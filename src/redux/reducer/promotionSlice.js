// File: src/redux/reducer/promotionSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/promotion`;

// ===================================================================
// THUNKS
// ===================================================================

export const promoteSelected = createAsyncThunk(
  'promotion/promoteSelected',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/v1/api/promotion/promote-selected`,
        payload,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const previewPromotion = createAsyncThunk(
  'promotion/preview',
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

export const executePromotion = createAsyncThunk(
  'promotion/execute',
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

export const getPromotionHistory = createAsyncThunk(
  'promotion/history',
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

export const getPromotionBatchDetail = createAsyncThunk(
  'promotion/batchDetail',
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

export const getPromotionBatchEnrollments = createAsyncThunk(
  'promotion/batchEnrollments',
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

export const undoPromotion = createAsyncThunk(
  'promotion/undo',
  async (batchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + `/undo/${batchId}`,
        {},
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const repeatStudent = createAsyncThunk(
  'promotion/repeatStudent',
  async ({ studentId, targetSessionId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const body = targetSessionId ? { targetSessionId } : {};
      const response = await api.post(
        BASE_URL + `/repeat/${studentId}`,
        body,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return { studentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// ===================================================================
// SLICE
// ===================================================================

const promotionSlice = createSlice({
  name: 'promotion',
  initialState: {
    preview: null,
    lastResult: null,
    history: [],
    batchDetail: null,
    batchEnrollments: [],

    previewingStatus: 'idle',
    executingStatus: 'idle',
    fetchingStatus: 'idle',
    undoingStatus: 'idle',
    repeatingStatus: 'idle',

    error: null,
  },
  reducers: {
    clearPromotionPreview(state) {
      state.preview = null;
    },
    clearPromotionResult(state) {
      state.lastResult = null;
    },
    clearPromotionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ---- preview ----
      .addCase(previewPromotion.pending, (state) => {
        state.previewingStatus = 'loading';
        state.error = null;
      })
      .addCase(previewPromotion.fulfilled, (state, action) => {
        state.previewingStatus = 'succeeded';
        state.preview = action.payload;
      })
      .addCase(previewPromotion.rejected, (state, action) => {
        state.previewingStatus = 'failed';
        state.error = action.payload?.message || 'Preview failed';
      })

      // ---- execute ----
      .addCase(executePromotion.pending, (state) => {
        state.executingStatus = 'loading';
        state.error = null;
      })
      .addCase(executePromotion.fulfilled, (state, action) => {
        state.executingStatus = 'succeeded';
        state.lastResult = action.payload;
        // prepend to history
        if (action.payload?.batchId) {
          state.history.unshift(action.payload);
        }
      })
      .addCase(executePromotion.rejected, (state, action) => {
        state.executingStatus = 'failed';
        state.error = action.payload?.message || 'Execute failed';
      })


.addCase(promoteSelected.pending, (state) => { state.executingStatus = 'loading'; })
.addCase(promoteSelected.fulfilled, (state) => { state.executingStatus = 'succeeded'; })
.addCase(promoteSelected.rejected, (state) => { state.executingStatus = 'failed'; })

      // ---- history ----
      .addCase(getPromotionHistory.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getPromotionHistory.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.history = action.payload || [];
      })
      .addCase(getPromotionHistory.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      // ---- batch detail ----
      .addCase(getPromotionBatchDetail.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getPromotionBatchDetail.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.batchDetail = action.payload;
      })
      .addCase(getPromotionBatchDetail.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      // ---- batch enrollments ----
      .addCase(getPromotionBatchEnrollments.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getPromotionBatchEnrollments.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.batchEnrollments = action.payload || [];
      })
      .addCase(getPromotionBatchEnrollments.rejected, (state) => {
        state.fetchingStatus = 'failed';
      })

      // ---- undo ----
      .addCase(undoPromotion.pending, (state) => {
        state.undoingStatus = 'loading';
      })
      .addCase(undoPromotion.fulfilled, (state, action) => {
        state.undoingStatus = 'succeeded';
        // Update the item in history
        const idx = state.history.findIndex((b) => b.batchId === action.payload?.batchId);
        if (idx !== -1) {
          state.history[idx] = {
            ...state.history[idx],
            undone: true,
          };
        }
        if (state.batchDetail?.batchId === action.payload?.batchId) {
          state.batchDetail = { ...state.batchDetail, undone: true };
        }
      })
      .addCase(undoPromotion.rejected, (state, action) => {
        state.undoingStatus = 'failed';
        state.error = action.payload?.message || 'Undo failed';
      })

      // ---- repeat ----
      .addCase(repeatStudent.pending, (state) => {
        state.repeatingStatus = 'loading';
      })
      .addCase(repeatStudent.fulfilled, (state) => {
        state.repeatingStatus = 'succeeded';
      })
      .addCase(repeatStudent.rejected, (state, action) => {
        state.repeatingStatus = 'failed';
        state.error = action.payload?.message || 'Repeat failed';
      });
  },
});

export const {
  clearPromotionPreview,
  clearPromotionResult,
  clearPromotionError,
} = promotionSlice.actions;

export default promotionSlice.reducer;