// File: src/redux/reducer/classSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/class`;

export const getClassNames = createAsyncThunk(
  'class/getClassNames',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-class-names', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllClass = createAsyncThunk(
  'class/getAllClass',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-all', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllClassnameAndId = createAsyncThunk(
  'class/getAllClassnameAndId',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-classname-and-id', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllClassnameAndSubjectCount = createAsyncThunk(
  'class/getAllClassnameAndSubjectCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-classname-and-subjectcount', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

/**
 * Fetch classes filtered by section and/or name.
 *
 * @param {Object} filters
 * @param {string} [filters.section] - CRECHE | KG | NURSERY | PRIMARY | SECONDARY
 * @param {string} [filters.name]    - JSS | SSS | PRI | Nursery | PreNursery | Creche | KG
 *
 * Both are optional. Passing neither returns all classes for the school.
 */
export const getClassesByFilter = createAsyncThunk(
  'class/getClassesByFilter',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.section) params.append('section', filters.section);
      if (filters.name) params.append('name', filters.name);

      const query = params.toString();
      const url = BASE_URL + '/get-classes-by-filter' + (query ? `?${query}` : '');

      const response = await api.get(url, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getClassCount = createAsyncThunk(
  'class/getClassCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-class-count', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getTeacherOwnedClass = createAsyncThunk(
  'class/getTeacherOwnedClass',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-teacher-classes', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getClassChart = createAsyncThunk(
  'class/getClassChart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-class-chart`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

/**
 * Count classes matching the given filters.
 * Same argument shape as getClassesByFilter.
 */
export const getClassCountByFilter = createAsyncThunk(
  'class/getClassCountByFilter',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.section) params.append('section', filters.section);
      if (filters.name) params.append('name', filters.name);

      const query = params.toString();
      const url = BASE_URL + '/get-class-count-by-filter' + (query ? `?${query}` : '');

      const response = await api.get(url, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getClass = createAsyncThunk(
  'class/getClass',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get/${name}`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const updateClass = createAsyncThunk(
  'class/updateClass',
  async ({ classData, className }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${className}`, classData, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const saveClass = createAsyncThunk(
  'class/saveClass',
  async (classData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', classData, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const classExists = createAsyncThunk(
  'class/checkClass',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/check-class-exists', { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const deleteClass = createAsyncThunk(
  'class/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState: {
    classes: [],
    classNames: [],
    classNamesSpecific: [],
    chartCounts: { CRECHE: [], KG: [], NURSERY: [], PRIMARY: [], SECONDARY: [] },
    classesOwnedByTeacher: [],
    classCount: 0,
    classCountSpecific: 0,
    classExist: null,
    savingStatus: 'idle',
    fetchingStatus: 'idle',
    deletingStatus: 'idle',
    existsStatus: 'idle',
    getStatus: 'idle',
    updateStatus: 'idle',
    error: null,
  },
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getClassNames.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getClassNames.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classNames = action.payload;
      })
      .addCase(getClassNames.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getAllClass.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllClass.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(getAllClass.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getAllClassnameAndId.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllClassnameAndId.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(getAllClassnameAndId.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getClassesByFilter.pending, (state) => {
        state.fetchingStatus = 'loading';
        state.classNamesSpecific = [];
      })
      .addCase(getClassesByFilter.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classNamesSpecific = action.payload;
      })
      .addCase(getClassesByFilter.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getAllClassnameAndSubjectCount.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllClassnameAndSubjectCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(getAllClassnameAndSubjectCount.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getTeacherOwnedClass.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getTeacherOwnedClass.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classesOwnedByTeacher = action.payload;
      })
      .addCase(getTeacherOwnedClass.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getClassChart.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getClassChart.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.chartCounts = action.payload;
      })
      .addCase(getClassChart.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getClassCount.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getClassCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classCount = action.payload;
      })
      .addCase(getClassCount.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(getClassCountByFilter.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getClassCountByFilter.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classCountSpecific = action.payload;
      })
      .addCase(getClassCountByFilter.rejected, (state) => { state.fetchingStatus = 'failed'; })

      .addCase(saveClass.pending, (state) => { state.savingStatus = 'loading'; })
      .addCase(saveClass.fulfilled, (state, action) => {
        state.classNamesSpecific = action.payload.classDto;
        state.savingStatus = 'succeeded';
      })
      .addCase(saveClass.rejected, (state) => { state.savingStatus = 'failed'; })

      .addCase(deleteClass.pending, (state) => { state.deletingStatus = 'loading'; })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.deletingStatus = 'succeeded';
        state.classNamesSpecific = state.classNamesSpecific.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(deleteClass.rejected, (state) => { state.deletingStatus = 'failed'; })

      .addCase(classExists.pending, (state) => { state.existsStatus = 'loading'; })
      .addCase(classExists.fulfilled, (state) => { state.existsStatus = 'succeeded'; })
      .addCase(classExists.rejected, (state) => { state.existsStatus = 'failed'; })

      .addCase(getClass.pending, (state) => { state.getStatus = 'loading'; })
      .addCase(getClass.fulfilled, (state) => { state.getStatus = 'succeeded'; })
      .addCase(getClass.rejected, (state) => { state.getStatus = 'failed'; })

      .addCase(updateClass.pending, (state) => { state.updateStatus = 'loading'; })
      .addCase(updateClass.fulfilled, (state, action) => {
        const index = state.classNamesSpecific.findIndex(
          (c) => c.id === action.payload.classDto.id
        );
        if (index !== -1) {
          state.classNamesSpecific[index] = action.payload.classDto;
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateClass.rejected, (state) => { state.updateStatus = 'failed'; });
  },
});

export default classSlice.reducer;