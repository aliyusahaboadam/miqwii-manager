// File: src/redux/reducer/partnerSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/partner`;

// =====================================================================
// PARTNER-ONLY THUNKS — partnerId comes from the JWT
// =====================================================================

export const createPartnerSchool = createAsyncThunk(
  'partner/createPartnerSchool',
  async (schoolData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + '/create-school',
        schoolData,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;   // BodyMessage { id, message, regNo }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getMyPartnerSessions = createAsyncThunk(
  'partner/getMyPartnerSessions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/sessions',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);


export const getPartnerSessions = createAsyncThunk(
  'partner/getPartnerSessions',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + `/sessions/${id}`,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getMyPartnerSchoolCount = createAsyncThunk(
  'partner/getMyPartnerSchoolCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/school-count',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getMyPartnerStudentCount = createAsyncThunk(
  'partner/getMyPartnerStudentCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/student-count',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getMyPartnerProfile = createAsyncThunk(
  'partner/getMyPartnerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/profile',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// =====================================================================
// SHARED THUNKS — take partnerId (admin or partner)
// =====================================================================

export const savePartner = createAsyncThunk(
  'partner/savePartner',
  async (partnerData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        BASE_URL + '/add',
        partnerData,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const updatePartner = createAsyncThunk(
  'partner/updatePartner',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        BASE_URL + `/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getPartnerById = createAsyncThunk(
  'partner/getPartnerById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + `/get/${id}`,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getPartnerSchools = createAsyncThunk(
  'partner/getPartnerSchools',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + `/schools/${id}`,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);



export const getMyPartnerStudentGenderCounts = createAsyncThunk(
  'partner/getMyPartnerStudentGenderCounts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/student-gender-counts',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;   // { maleCount, femaleCount, totalCount }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getMyPartnerClassCounts = createAsyncThunk(
  'partner/getMyPartnerClassCounts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/class-counts',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;   // { CRECHE: n, KG: n, NURSERY: n, PRIMARY: n, SECONDARY: n }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);



export const getMyPartnerSchools = createAsyncThunk(
  'partner/getMyPartnerSchools',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/authenticated-partner-schools',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getAllPartners = createAsyncThunk(
  'partner/getAllPartners',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/all',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

export const getMyPartnerTeacherCounts = createAsyncThunk(
  'partner/getMyPartnerTeacherCounts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        BASE_URL + '/teacher-counts',
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
  }
);

// =====================================================================
// SLICE
// =====================================================================

const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    partner: null,                 // partner profile (from /me or /get/{id})
    partnerSchools: [],
    allPartners: [],
    partnerSchoolCount: 0,
    partnerStudentCount: 0,
    partnerStudentGenderCounts: { maleCount: 0, femaleCount: 0, totalCount: 0 },
    partnerClassCounts: {},       
    partnerTeacherCounts: {},
    partnerSessions: [],
    savingStatus: 'idle',
    fetchingStatus: 'idle',
    updatingStatus: 'idle',
    error: null,
  },
  reducers: {
    resetStatus(state) {
      state.savingStatus = 'idle';
      state.fetchingStatus = 'idle';
      state.updatingStatus = 'idle';
      state.error = null;
    },
   clearPartner(state) {
  state.partner = null;
  state.partnerSchools = [];
  state.partnerSchoolCount = 0;
  state.partnerStudentCount = 0;
  state.partnerSessions = [];
  state.partnerStudentGenderCounts = { maleCount: 0, femaleCount: 0, totalCount: 0 };
  state.partnerClassCounts = {};
  state.partnerTeacherCounts = {};
  state.error = null;
},
  },
  extraReducers: (builder) => {
    builder
      // ---------- PARTNER-ONLY ----------
      .addCase(createPartnerSchool.pending, (state) => {
        state.savingStatus = 'loading';
      })
      .addCase(createPartnerSchool.fulfilled, (state) => {
        state.savingStatus = 'succeeded';
        // component should refetch getPartnerSchools after
      })
      .addCase(createPartnerSchool.rejected, (state, action) => {
        state.savingStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(getMyPartnerSessions.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getMyPartnerSessions.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.partnerSessions = action.payload;
      })
      .addCase(getMyPartnerSessions.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload;
      })



      .addCase(getPartnerSessions.pending, (state) => {
  state.fetchingStatus = 'loading';
})
.addCase(getPartnerSessions.fulfilled, (state, action) => {
  state.fetchingStatus = 'succeeded';
  state.partnerSessions = action.payload;
})
.addCase(getPartnerSessions.rejected, (state, action) => {
  state.fetchingStatus = 'failed';
  state.error = action.payload;
})


      .addCase(getMyPartnerSchools.pending, (state) => {
  state.fetchingStatus = 'loading';
})
.addCase(getMyPartnerSchools.fulfilled, (state, action) => {
  state.fetchingStatus = 'succeeded';
  state.partnerSchools = action.payload;
})
.addCase(getMyPartnerSchools.rejected, (state, action) => {
  state.fetchingStatus = 'failed';
  state.error = action.payload;
})

.addCase(getAllPartners.pending, (state) => {
  state.fetchingStatus = 'loading';
})
.addCase(getAllPartners.fulfilled, (state, action) => {
  state.fetchingStatus = 'succeeded';
  state.allPartners = action.payload;
})
.addCase(getAllPartners.rejected, (state, action) => {
  state.fetchingStatus = 'failed';
  state.error = action.payload;
})


      .addCase(getMyPartnerStudentGenderCounts.fulfilled, (state, action) => {
  state.partnerStudentGenderCounts = action.payload;
})
.addCase(getMyPartnerClassCounts.fulfilled, (state, action) => {
  state.partnerClassCounts = action.payload;
})
.addCase(getMyPartnerTeacherCounts.fulfilled, (state, action) => {
  state.partnerTeacherCounts = action.payload;
})

      .addCase(getMyPartnerSchoolCount.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getMyPartnerSchoolCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.partnerSchoolCount = action.payload;
      })
      .addCase(getMyPartnerSchoolCount.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(getMyPartnerStudentCount.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getMyPartnerStudentCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.partnerStudentCount = action.payload;
      })
      .addCase(getMyPartnerStudentCount.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(getMyPartnerProfile.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getMyPartnerProfile.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.partner = action.payload;
      })
      .addCase(getMyPartnerProfile.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload;
      })

      // ---------- SHARED (admin / partner) ----------
      .addCase(savePartner.pending, (state) => {
        state.savingStatus = 'loading';
      })
      .addCase(savePartner.fulfilled, (state, action) => {
        state.savingStatus = 'succeeded';
        state.partner = action.payload;
      })
      .addCase(savePartner.rejected, (state, action) => {
        state.savingStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(updatePartner.pending, (state) => {
        state.updatingStatus = 'loading';
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.updatingStatus = 'succeeded';
        state.partner = action.payload;
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.updatingStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(getPartnerById.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getPartnerById.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.partner = action.payload;
      })
      .addCase(getPartnerById.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(getPartnerSchools.pending, (state) => {
        state.fetchingStatus = 'loading';
      })
      .addCase(getPartnerSchools.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.partnerSchools = action.payload;
      })
      .addCase(getPartnerSchools.rejected, (state, action) => {
        state.fetchingStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetStatus, clearPartner } = partnerSlice.actions;
export default partnerSlice.reducer;