import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/settings`;

const DEFAULT_TEMPLATE = 'DEFAULT_2CA_20_20_EXAM_60';

// ---------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------

/**
 * Read the school's settings.
 * Returns a flat object with all 15 settings fields plus `id`:
 *   disableFirstCA, disableSecondCA, disableThirdCA, disableAssignment,
 *   disableExam, disablePositioning, disableTeacherRemark,
 *   disableNextTermFees, disableQrCode, disableTermPerformanceSummary,
 *   crecheTemplate, kgTemplate, nurseryTemplate, primaryTemplate,
 *   secondaryTemplate
 *
 * All disable fields are booleans: false = enabled/shown, true = disabled/hidden.
 */
export const getSettingsState = createAsyncThunk(
  'settings/getSettingsState',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`${BASE_URL}/get-settings-state`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

/**
 * Partial update of the school's settings.
 *
 * Send only the fields you want to change — the backend applies only
 * the non-null fields and leaves everything else untouched.
 *
 *   InputControl page       → { disableFirstCA, disableSecondCA,
 *                               disableThirdCA, disableAssignment,
 *                               disableExam }
 *   ResultSettings page     → { disablePositioning, disableTeacherRemark,
 *                               disableNextTermFees, disableQrCode,
 *                               disableTermPerformanceSummary }
 *   AssessmentSettings page → { crecheTemplate, kgTemplate, ... }
 *
 * Returns the full updated settings object, so the reducer can replace
 * the entire state in one go.
 */
export const updateResultConfig = createAsyncThunk(
  'settings/updateResultConfig',
  async (partialUpdate, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `${BASE_URL}/result-config`,
        partialUpdate,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

// ---------------------------------------------------------------------
// Helper — one place copies every field from the backend payload into
// state. Used by both fulfilled cases so the two never drift.
// ---------------------------------------------------------------------

const applySettingsPayload = (state, payload) => {
  const d = payload || {};

  // Input control — false = enabled by default
  state.disableFirstCA    = d.disableFirstCA    ?? false;
  state.disableSecondCA   = d.disableSecondCA   ?? false;
  state.disableThirdCA    = d.disableThirdCA    ?? false;
  state.disableAssignment = d.disableAssignment ?? false;
  state.disableExam       = d.disableExam       ?? false;

  // Layout flags — false = shown by default
  state.disablePositioning            = d.disablePositioning            ?? false;
  state.disableTeacherRemark          = d.disableTeacherRemark          ?? false;
  state.disableNextTermFees           = d.disableNextTermFees           ?? false;
  state.disableQrCode                 = d.disableQrCode                 ?? false;
  state.disableTermPerformanceSummary = d.disableTermPerformanceSummary ?? false;

  // Templates
  state.crecheTemplate    = d.crecheTemplate    ?? DEFAULT_TEMPLATE;
  state.kgTemplate        = d.kgTemplate        ?? DEFAULT_TEMPLATE;
  state.nurseryTemplate   = d.nurseryTemplate   ?? DEFAULT_TEMPLATE;
  state.primaryTemplate   = d.primaryTemplate   ?? DEFAULT_TEMPLATE;
  state.secondaryTemplate = d.secondaryTemplate ?? DEFAULT_TEMPLATE;
};

// ---------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    // Input control
    disableFirstCA:    false,
    disableSecondCA:   false,
    disableThirdCA:    false,
    disableAssignment: false,
    disableExam:       false,

    // Layout flags
    disablePositioning:            false,
    disableTeacherRemark:          false,
    disableNextTermFees:           false,
    disableQrCode:                 false,
    disableTermPerformanceSummary: false,

    // Assessment templates
    crecheTemplate:    DEFAULT_TEMPLATE,
    kgTemplate:        DEFAULT_TEMPLATE,
    nurseryTemplate:   DEFAULT_TEMPLATE,
    primaryTemplate:   DEFAULT_TEMPLATE,
    secondaryTemplate: DEFAULT_TEMPLATE,

    // Status
    fetchingStatus: 'idle',
    updatingStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getSettingsState.pending, (state) => {
        state.fetchingStatus = 'loading';
        state.error = null;
      })
      .addCase(getSettingsState.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        applySettingsPayload(state, action.payload);
      })
      .addCase(getSettingsState.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload?.message || 'Failed to fetch settings';
      })

      .addCase(updateResultConfig.pending, (state) => {
        state.updatingStatus = 'loading';
        state.error = null;
      })
      .addCase(updateResultConfig.fulfilled, (state, action) => {
        state.updatingStatus = 'succeeded';
        applySettingsPayload(state, action.payload);
      })
      .addCase(updateResultConfig.rejected, (state, action) => {
        state.updatingStatus = 'failed';
        state.error = action.payload?.message || 'Failed to update settings';
      });
  },
});

export default settingsSlice.reducer;