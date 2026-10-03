// File: src/redux/reducer/schoolSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${import.meta.env.VITE_API_URL}/v1/api/school`;

// ---------------------------------------------------------------
// Existing thunks — unchanged
// ---------------------------------------------------------------

export const saveSchool = createAsyncThunk(
  'School/AddingSchool',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL + '/add', requestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getAuthSchool = createAsyncThunk(
  'class/getAuthSchool',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-auth-school`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getSchoolWithBasicDetails = createAsyncThunk(
  'class/getSchoolWithBasicDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-with-basic-details`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getSchoolForPaymentDisplayById = createAsyncThunk(
  'class/getAuthSchoolForPaymentDisplay',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-with-payment-details-by-id`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getSchoolById = createAsyncThunk(
  'class/getAuthSchool',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-by-id/${id}`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getSchoolByDomain = createAsyncThunk(
  'class/getSchoolByDomain',
  async (domain, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL + `/get-school-by-domain/${domain}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const uploadLogo = createAsyncThunk(
  'school/uploadLogo',
  async (logoData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/save-logo`, logoData, { headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "multipart/form-data" } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const updateSchool = createAsyncThunk(
  'school/updateSchool',
  async ({ id, schoolData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update-school/${id}`, schoolData, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const updateDomainName = createAsyncThunk(
  'school/updateDomainName',
  async ({ id, domainName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update-domain-name/${id}`, { domainName }, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const schoolActivator = createAsyncThunk(
  'school/schoolActivator',
  async ({ id, activatorStatus }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/school-activator/${id}`, activatorStatus, { headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const studentActivator = createAsyncThunk(
  'school/studentActivator',
  async ({ id, activatorStatus }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/student-activator/${id}`, activatorStatus, { headers: { "Authorization": `Bearer ${JSON.parse(token)}`, "Content-Type": "application/json" } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllSchoolCount = createAsyncThunk(
  'school/getAllSchoolCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-school-count`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllTeachersCount = createAsyncThunk(
  'school/getAllTeachersCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-teacher-count`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllStudentCount = createAsyncThunk(
  'school/getAllStudentCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-student-count`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllStudentCountMale = createAsyncThunk(
  'school/getAllStudentCountMale',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-student-count-male`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getAllStudentCountFemale = createAsyncThunk(
  'school/getAllStudentCountFemale',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-student-count-female`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

// ---------------------------------------------------------------
// NEW — section-based class counts
// Replaces: getAllClassCountJss, getAllClassCountSss, getAllClassCountPri
// ---------------------------------------------------------------

export const getClassCountsBySection = createAsyncThunk(
  'school/getClassCountsBySection',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-class-counts-by-section`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;   // Map<String, Integer> e.g. { CRECHE: 2, KG: 1, NURSERY: 3, PRIMARY: 6, SECONDARY: 4 }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

// ---------------------------------------------------------------
// NEW — section-based teacher counts
// Replaces: getAllClassCountJssTeacher, getAllClassCountSssTeachers, getAllClassCountPriTeachers
// ---------------------------------------------------------------

export const getTeacherCountsBySection = createAsyncThunk(
  'school/getTeacherCountsBySection',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-teacher-counts-by-section`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;   // Map<String, Integer>
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const getSchoolAlongWithDetails = createAsyncThunk(
  'school/getSchoolAlongWithDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-along-with-details`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const deleteSchool = createAsyncThunk(
  'Student/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`, { headers: { "Authorization": `Bearer ${JSON.parse(token)}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ---------------------------------------------------------------
// Slice
// ---------------------------------------------------------------

const schoolSlice = createSlice({
  name: 'School',
  initialState: {
    schools: [],
    school: null,
    allSchoolCount: 0,
    allStudentCount: 0,
    allTeachersCount: 0,
    allStudentCountMale: 0,
    allStudentCountFamale: 0,

    // NEW — one map per category, keyed by section
    classCountsBySection: { CRECHE: 0, KG: 0, NURSERY: 0, PRIMARY: 0, SECONDARY: 0 },
    teacherCountsBySection: { CRECHE: 0, KG: 0, NURSERY: 0, PRIMARY: 0, SECONDARY: 0 },

    schoolStatus: 'idle',
    savingStatus: 'idle',
    fetchingStatus: 'idle',
    deletingStatus: 'idle',
    existsStatus: 'idle',
    getStatus: 'idle',
    updateStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // SAVE SCHOOL
      .addCase(saveSchool.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(saveSchool.fulfilled, (state) => { state.fetchingStatus = 'succeeded'; })
      .addCase(saveSchool.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // STUDENT ACTIVATOR
      .addCase(studentActivator.pending, (state) => { state.savingStatus = 'loading'; })
      .addCase(studentActivator.fulfilled, (state) => { state.savingStatus = 'succeeded'; })
      .addCase(studentActivator.rejected, (state) => { state.savingStatus = 'failed'; })

      // GET AUTH SCHOOL
      .addCase(getAuthSchool.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAuthSchool.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.school = action.payload;
      })
      .addCase(getAuthSchool.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET ALL SCHOOL COUNT
      .addCase(getAllSchoolCount.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllSchoolCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.allSchoolCount = action.payload;
      })
      .addCase(getAllSchoolCount.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET ALL STUDENT COUNT
      .addCase(getAllStudentCount.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllStudentCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.allStudentCount = action.payload;
      })
      .addCase(getAllStudentCount.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET ALL TEACHER COUNT
      .addCase(getAllTeachersCount.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllTeachersCount.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.allTeachersCount = action.payload;
      })
      .addCase(getAllTeachersCount.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET ALL STUDENT COUNT MALE
      .addCase(getAllStudentCountMale.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllStudentCountMale.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.allStudentCountMale = action.payload;
      })
      .addCase(getAllStudentCountMale.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET ALL STUDENT COUNT FEMALE
      .addCase(getAllStudentCountFemale.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getAllStudentCountFemale.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.allStudentCountFamale = action.payload;
      })
      .addCase(getAllStudentCountFemale.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // NEW — CLASS COUNTS BY SECTION
      .addCase(getClassCountsBySection.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getClassCountsBySection.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.classCountsBySection = {
          CRECHE: 0, KG: 0, NURSERY: 0, PRIMARY: 0, SECONDARY: 0,
          ...(action.payload || {}),
        };
      })
      .addCase(getClassCountsBySection.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // NEW — TEACHER COUNTS BY SECTION
      .addCase(getTeacherCountsBySection.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getTeacherCountsBySection.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.teacherCountsBySection = {
          CRECHE: 0, KG: 0, NURSERY: 0, PRIMARY: 0, SECONDARY: 0,
          ...(action.payload || {}),
        };
      })
      .addCase(getTeacherCountsBySection.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET ALL SCHOOL WITH DETAILS (ADMIN)
      .addCase(getSchoolAlongWithDetails.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getSchoolAlongWithDetails.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.schools = action.payload;
      })
      .addCase(getSchoolAlongWithDetails.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // GET SCHOOL WITH BASIC DETAILS
      .addCase(getSchoolWithBasicDetails.pending, (state) => { state.fetchingStatus = 'loading'; })
      .addCase(getSchoolWithBasicDetails.fulfilled, (state, action) => {
        state.fetchingStatus = 'succeeded';
        state.school = action.payload;
      })
      .addCase(getSchoolWithBasicDetails.rejected, (state) => { state.fetchingStatus = 'failed'; })

      // DELETE SCHOOL
      .addCase(deleteSchool.pending, (state) => { state.deletingStatus = 'loading'; })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.deletingStatus = 'succeeded';
        state.schools = state.schools.filter(school => school.id !== action.payload.id);
      })
      .addCase(deleteSchool.rejected, (state) => { state.deletingStatus = 'failed'; })

      // UPLOAD LOGO
      .addCase(uploadLogo.pending, (state) => { state.savingStatus = 'loading'; })
      .addCase(uploadLogo.fulfilled, (state) => { state.savingStatus = 'succeeded'; })
      .addCase(uploadLogo.rejected, (state) => { state.savingStatus = 'failed'; })

      // SCHOOL ACTIVATOR
      .addCase(schoolActivator.pending, (state) => { state.updateStatus = 'loading'; })
      .addCase(schoolActivator.fulfilled, (state, action) => {
        const index = state.schools.findIndex(user => user.id === action.payload.schoolDto.id);
        if (index !== -1) {
          state.schools[index] = action.payload.schoolDto;
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(schoolActivator.rejected, (state) => { state.updateStatus = 'failed'; })

      // UPDATE SCHOOL
      .addCase(updateSchool.pending, (state) => { state.updateStatus = 'loading'; })
      .addCase(updateSchool.fulfilled, (state, action) => {
        const index = state.schools.findIndex(user => user.id === action.payload.schoolDto.id);
        if (index !== -1) {
          state.schools[index] = action.payload.schoolDto;
        }
        state.updateStatus = 'succeeded';
      })
      .addCase(updateSchool.rejected, (state) => { state.updateStatus = 'failed'; })

      // UPDATE DOMAIN NAME
      .addCase(updateDomainName.pending, (state) => { state.updateStatus = 'loading'; })
      .addCase(updateDomainName.fulfilled, (state) => { state.updateStatus = 'succeeded'; })
      .addCase(updateDomainName.rejected, (state) => { state.updateStatus = 'failed'; });
  },
});

export default schoolSlice.reducer;