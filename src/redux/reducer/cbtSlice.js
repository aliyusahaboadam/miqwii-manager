// src/redux/reducer/cbtSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../component/routing/Interceptor';

const cbtApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/v1/api/cbt`,
});

cbtApi.interceptors.request.use((config) => {
    const cbtToken = localStorage.getItem('cbt_token');
    const normalToken = localStorage.getItem('token');

    if (config.url.includes('/student/')) {
        if (cbtToken) {
            config.headers.Authorization = `Bearer ${JSON.parse(cbtToken)}`;
        } else if (normalToken) {
            config.headers.Authorization = `Bearer ${JSON.parse(normalToken)}`;
        }
    } else if (normalToken) {
        config.headers.Authorization = `Bearer ${JSON.parse(normalToken)}`;
    }

    config.headers['X-Client'] = 'MiqwiiCBT/1.0';
    return config;
});

// =====================================================================
// THUNKS
// =====================================================================

export const cbtLogin = createAsyncThunk('cbt/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/v1/api/cbt/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
});

// ✅ NEW — teacher's own exams only
export const getMyTeacherExams = createAsyncThunk(
    'cbt/getMyTeacherExams',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cbtApi.get('/teacher/my-exams');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch exams');
        }
    }
);

// admin — all school exams
export const getTeacherExams = createAsyncThunk('cbt/getTeacherExams', async (_, { rejectWithValue }) => {
    try {
        const response = await cbtApi.get('/teacher/exams');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch exams');
    }
});

export const createCbtExam = createAsyncThunk('cbt/createExam', async (examData, { rejectWithValue }) => {
    try {
        const response = await cbtApi.post('/teacher/exam', examData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create exam');
    }
});

export const getTeacherExamById = createAsyncThunk('cbt/getTeacherExamById', async (examId, { rejectWithValue }) => {
    try {
        const response = await cbtApi.get(`/teacher/exam/${examId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to load exam');
    }
});

// ✅ NEW — duplicate
export const duplicateTeacherExam = createAsyncThunk(
    'cbt/duplicateTeacherExam',
    async ({ examId, name }, { rejectWithValue }) => {
        try {
            const response = await cbtApi.post(`/teacher/exam/${examId}/duplicate`, { name });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to duplicate exam');
        }
    }
);

export const deleteTeacherExam = createAsyncThunk(
    'cbt/deleteTeacherExam',
    async (examId, { rejectWithValue }) => {
        try {
            await cbtApi.delete(`/teacher/exam/${examId}`);
            return examId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete exam');
        }
    }
);

export const getTemplateRules = createAsyncThunk(
    'cbt/getTemplateRules',
    async (className, { rejectWithValue }) => {
        try {
            const response = await cbtApi.get(`/teacher/template-rules/${className}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to load template rules');
        }
    }
);

// Student thunks
export const getActiveExam = createAsyncThunk('cbt/getActiveExam', async (_, { rejectWithValue }) => {
    try {
        const response = await cbtApi.get('/student/active');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'No active exam found');
    }
});

export const startExamAttempt = createAsyncThunk('cbt/startExam', async (examId, { rejectWithValue }) => {
    try {
        const response = await cbtApi.post(`/student/start/${examId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to start exam');
    }
});

export const saveStudentAnswer = createAsyncThunk(
    'cbt/saveAnswer',
    async ({ attemptId, questionId, selectedOptions, isMarkedForReview }, { rejectWithValue }) => {
        try {
            await cbtApi.post(`/student/attempt/${attemptId}/save`,
                { questionId, selectedOptions, isMarkedForReview });
            return { questionId, selectedOptions, isMarkedForReview };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to save answer');
        }
    }
);

export const submitExamAttempt = createAsyncThunk('cbt/submitExam', async (attemptId, { rejectWithValue }) => {
    try {
        const response = await cbtApi.post(`/student/attempt/${attemptId}/submit`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to submit exam');
    }
});


export const getAllSchoolExams = createAsyncThunk(
    'cbt/getAllSchoolExams',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cbtApi.get('/teacher/exams/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch exams');
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTeacherExams.fulfilled, (state, action) => {
                state.teacherExams = action.payload;
            })
            .addCase(getMyTeacherExams.fulfilled, (state, action) => {
                state.teacherExams = action.payload;
            })
            .addCase(getActiveExam.fulfilled, (state, action) => {
                state.activeExam = action.payload.hasExam ? action.payload : null;
            })
            .addCase(startExamAttempt.pending, (state) => { state.status = 'loading'; })
            .addCase(startExamAttempt.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentAttempt = action.payload;
                const savedAnswers = {};
                if (action.payload.savedAnswers) {
                    action.payload.savedAnswers.forEach((ans) => {
                        savedAnswers[ans.questionId] = {
                            selectedOptions: ans.selectedOptions,
                            isMarkedForReview: ans.isMarkedForReview,
                            isVisited: true,
                        };
                    });
                }
                state.answers = savedAnswers;
            })
            .addCase(startExamAttempt.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(saveStudentAnswer.fulfilled, (state, action) => {
                const { questionId, selectedOptions, isMarkedForReview } = action.payload;
                state.answers[questionId] = { selectedOptions, isMarkedForReview, isVisited: true };
            })
            .addCase(deleteTeacherExam.fulfilled, (state, action) => {
                state.teacherExams = state.teacherExams.filter((e) => e.id !== action.payload);
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
    },
});

export const { clearActiveExam, clearSelectedExam } = cbtSlice.actions;
export default cbtSlice.reducer;