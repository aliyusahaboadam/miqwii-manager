// src/redux/reducer/cbtSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../component/routing/Interceptor';

// 1. Update the baseURL to include the full path
const cbtApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/v1/api/cbt`, 
});

// 2. Update the Interceptor to check for BOTH student and teacher tokens
// src/redux/reducer/cbtSlice.js

cbtApi.interceptors.request.use((config) => {
    const cbtToken = localStorage.getItem('cbt_token');
    const normalToken = localStorage.getItem('token');
    
    // If the request is for the student exam, use the CBT token.
    // If the request is for the teacher, use the normal teacher/admin token.
    if (config.url.includes('/student/')) {
        if (cbtToken) {
            config.headers.Authorization = `Bearer ${JSON.parse(cbtToken)}`;
        } else if (normalToken) {
            config.headers.Authorization = `Bearer ${JSON.parse(normalToken)}`;
        }
    } else {
        // Teacher routes
        if (normalToken) {
            config.headers.Authorization = `Bearer ${JSON.parse(normalToken)}`;
        }
    }
    
    return config;
});



// =====================================================================
// THUNKS
// =====================================================================

// 1. CBT Login (Uses the normal API because they don't have a CBT token yet)
export const cbtLogin = createAsyncThunk('cbt/login', async (credentials, { rejectWithValue }) => {
    try {
        // Use the full path directly so we don't need the BASE_URL variable
        const response = await api.post(`/v1/api/cbt/login`, credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login failed");
    }
});

// 2. Teacher: Get Exams (Uses cbtApi)
export const getTeacherExams = createAsyncThunk('cbt/getTeacherExams', async (_, { rejectWithValue }) => {
    try {
        const response = await cbtApi.get(`/teacher/exams`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch exams");
    }
});

// 3. Teacher: Create Exam
export const createCbtExam = createAsyncThunk('cbt/createExam', async (examData, { rejectWithValue }) => {
    try {
        const response = await cbtApi.post(`/teacher/exam`, examData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to create exam");
    }
});

// 4. Student: Get Active Exam
export const getActiveExam = createAsyncThunk('cbt/getActiveExam', async (_, { rejectWithValue }) => {
    try {
        const response = await cbtApi.get(`/student/active`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "No active exam found");
    }
});

// 5. Student: Start Exam Attempt
export const startExamAttempt = createAsyncThunk('cbt/startExam', async (examId, { rejectWithValue }) => {
    try {
        const response = await cbtApi.post(`/student/start/${examId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to start exam");
    }
});

// 6. Student: Save Answer (Autosave)
export const saveStudentAnswer = createAsyncThunk('cbt/saveAnswer', async ({ attemptId, questionId, selectedOptions, isMarkedForReview }, { rejectWithValue }) => {
    try {
        await cbtApi.post(`/student/attempt/${attemptId}/save`, 
            { questionId, selectedOptions, isMarkedForReview }
        );
        return { questionId, selectedOptions, isMarkedForReview };
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to save answer");
    }
});

// 7. Student: Submit Exam
export const submitExamAttempt = createAsyncThunk('cbt/submitExam', async (attemptId, { rejectWithValue }) => {
    try {
        const response = await cbtApi.post(`/student/attempt/${attemptId}/submit`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to submit exam");
    }
});


// ✅ teacher delete
export const deleteTeacherExam = createAsyncThunk(
  'cbt/deleteTeacherExam',
  async (examId, { rejectWithValue }) => {
    try {
      await cbtApi.delete(`/teacher/exam/${examId}`);
      return examId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete exam");
    }
  }
);

// ✅ teacher get-by-id (used by edit + details pages)
export const getTeacherExamById = createAsyncThunk(
  'cbt/getTeacherExamById',
  async (examId, { rejectWithValue }) => {
    try {
      const response = await cbtApi.get(`/teacher/exam/${examId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load exam");
    }
  }
);



// ✅ Teacher: Get Template Rules for a Class
export const getTemplateRules = createAsyncThunk(
  'cbt/getTemplateRules',
  async (className, { rejectWithValue }) => {
    try {
      const response = await cbtApi.get(`/teacher/template-rules/${className}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch template rules");
    }
  }
);


// =====================================================================
// SLICE
// =====================================================================
const cbtSlice = createSlice({
    name: 'cbt',
    initialState: {
        teacherExams: [],
        activeExam: null,
        currentAttempt: null,
        selectedExam: null,
        answers: {},
        status: 'idle',
        error: null,
    },
    reducers: {
        clearActiveExam: (state) => {
            state.activeExam = null;
            state.currentAttempt = null;
            state.answers = {};
        },
     clearSelectedExam: (state) => {
    state.selectedExam = null;
}
    },
    extraReducers: (builder) => {
        builder
            // Handle Teacher Exams
            .addCase(getTeacherExams.fulfilled, (state, action) => {
                state.teacherExams = action.payload;
            })
            // Handle Student Active Exam
            .addCase(getActiveExam.fulfilled, (state, action) => {
                state.activeExam = action.payload.hasExam ? action.payload : null;
            })
            // Handle Exam Start (and restore saved answers)
            .addCase(startExamAttempt.pending, (state) => { state.status = 'loading'; })
            .addCase(startExamAttempt.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentAttempt = action.payload;
                
                const savedAnswers = {};
                if (action.payload.savedAnswers) {
                    action.payload.savedAnswers.forEach(ans => {
                        savedAnswers[ans.questionId] = { 
                            selectedOptions: ans.selectedOptions, 
                            isMarkedForReview: ans.isMarkedForReview, 
                            isVisited: true 
                        };
                    });
                }
                state.answers = savedAnswers;
            })
            .addCase(startExamAttempt.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Handle Autosave updates
            .addCase(saveStudentAnswer.fulfilled, (state, action) => {
                const { questionId, selectedOptions, isMarkedForReview } = action.payload;
                state.answers[questionId] = { selectedOptions, isMarkedForReview, isVisited: true };
            })
            
            
.addCase(deleteTeacherExam.fulfilled, (state, action) => {
    state.teacherExams = state.teacherExams.filter(e => e.id !== action.payload);
})
.addCase(getTeacherExamById.pending, (state) => { state.status = 'loading'; })
.addCase(getTeacherExamById.fulfilled, (state, action) => {
    state.status = 'succeeded';
    state.selectedExam = action.payload;
})
.addCase(getTeacherExamById.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload;
});
    }
});

export const { clearActiveExam, clearSelectedExam } = cbtSlice.actions;
export default cbtSlice.reducer;