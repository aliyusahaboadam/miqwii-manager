import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/teacher`;

export const saveTeacher = createAsyncThunk(
  'teacher/saveTeacher',
  async (teacherData, thunkAPI) => {
    try {
      console.log(teacherData);
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/add`, teacherData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const getTeacherCount = createAsyncThunk(
  'teacher/allTeacherCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-teachers-count' ,{ headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const getAllTeachers = createAsyncThunk(
  'teacher/getAllTeacher',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-all',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const getTeacherById = createAsyncThunk(
  'teacher/getTeacherById',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-id/${id}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getAuthenticatedTeacherById = createAsyncThunk(
  'teacher/getAuthenticatedTeacherById',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-authenticated-teacher-by-id`,{ headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getWelcomeMessage = createAsyncThunk(
  'teacher/getWelcomeMessage',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/welcome`,   { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const deleteTeacherById = createAsyncThunk(
  'teacher/deleteTeacherById',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const updateTeacher = createAsyncThunk(
  'teacher/updateTeacher',
  async ({id, teacherData},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, teacherData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const teacherSlice = createSlice({
    name: 'teacher',
    initialState: {
        teachers: [],
        teacher: [],
        welcomeMessage: '',
        teachersCount: 0,
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
        existsStatus: 'idle',
        error: null,
    },
    reducers: {
      resetStatus (state) {
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
        builder
          .addCase(saveTeacher.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveTeacher.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
           
          })
          .addCase(saveTeacher.rejected, (state) => {
            state.savingStatus = 'failed';
          })


          // get All Teachers

          .addCase(getAllTeachers.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllTeachers.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.teachers = action.payload;
          })
          .addCase(getAllTeachers.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

         
          // get Teachers Count
          
          .addCase(getTeacherCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getTeacherCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.teachersCount = action.payload;
          })
          .addCase(getTeacherCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


            // Get Teacher By Id
          
            .addCase(getTeacherById.pending, (state) => {
              state.fetchingStatus = 'loading';
            })
            .addCase(getTeacherById.fulfilled, (state, action) => {
              state.fetchingStatus = 'succeeded';
              state.teacher = action.payload;
              
            })
            .addCase(getTeacherById.rejected, (state) => {
              state.fetchingStatus = 'failed';
            })



              // Get Authenticated Teacher By Id
          
            .addCase(getAuthenticatedTeacherById.pending, (state) => {
              state.fetchingStatus = 'loading';
            })
            .addCase(getAuthenticatedTeacherById.fulfilled, (state, action) => {
              state.fetchingStatus = 'succeeded';
              state.teacher = action.payload;
              
            })
            .addCase(getAuthenticatedTeacherById.rejected, (state) => {
              state.fetchingStatus = 'failed';
            })


               // Welcome message
          
            .addCase(getWelcomeMessage.pending, (state) => {
              state.fetchingStatus = 'loading';
            })
            .addCase(getWelcomeMessage.fulfilled, (state, action) => {
              state.fetchingStatus = 'succeeded';
              state.welcomeMessage = action.payload;
              
            })
            .addCase(getWelcomeMessage.rejected, (state) => {
              state.fetchingStatus = 'failed';
            })




             // Delete Subject By Id
            
                        .addCase(deleteTeacherById.pending, (state) => {
                          state.deletingStatus = 'loading';
                        })
                        .addCase(deleteTeacherById.fulfilled, (state, action) => {
                          state.deletingStatus = 'succeeded';
                          state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload.id);
                
                        })
                        .addCase(deleteTeacherById.rejected, (state) => {
                          state.deletingStatus = 'failed';
                        })


                        // update Subject
                        
                                     .addCase(updateTeacher.pending, (state) => {
                                      state.updateStatus = 'loading';
                                    })
                                   
                                     .addCase(updateTeacher.fulfilled, (state, action) => {
                                      state.updateStatus = 'succeeded';
                                      const index = state.teachers.findIndex(teacher => teacher.id === action.payload.teacherDto.id);
                                       if (index !== -1) {
                                      state.teachers[index] = action.payload.teacherDto;
                                      }
                                      })
                                     .addCase(updateTeacher.rejected, (state) => {
                                      state.updateStatus = 'failed';
                                    });
            
            
      },

});

export const { resetStatus } = teacherSlice.actions;
export default teacherSlice.reducer;