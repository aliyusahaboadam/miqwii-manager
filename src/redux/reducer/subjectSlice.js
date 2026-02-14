import { Construction } from '@mui/icons-material';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/subject`;

export const saveSubject = createAsyncThunk(
  'subject/saveSubject',
  async ({className, subjects}, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/add/${className}`, subjects, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getSubjectByClass = createAsyncThunk(
  'class/getSubjectByClass',
  async (className,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/class/${className}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});

      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSubjectById = createAsyncThunk(
  'class/getSubjectById',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getTeacherSubjectsByClassId = createAsyncThunk(
  'class/getTeacherSubjects',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/teacher-subjects/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getAllSubjectWithClassname = createAsyncThunk(
  'class/getAllSubjectWithClassname',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-with-classname`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const deleteSubject = createAsyncThunk(
  'class/deleteSubjectById',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const updateSubject = createAsyncThunk(
  'subject/updateSubject',
  async ({id, subjectData},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, subjectData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const subjectSlice = createSlice({
    name: 'subjects',
    initialState: {
        subjects: [],
        subjectWithClassname: [],
        teacherSubjects: [],
        subjectsInClass: [],
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
        updateStatus: 'idle',
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
          .addCase(saveSubject.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveSubject.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(saveSubject.rejected, (state) => {
            state.savingStatus = 'failed';
          })

           // get subject by class

          .addCase(getSubjectByClass.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getSubjectByClass.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.subjectsInClass = action.payload;
          })
          .addCase(getSubjectByClass.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



              


                   // get Teacher subjects by class id

              .addCase(getTeacherSubjectsByClassId.pending, (state) => {
                state.fetchingStatus = 'loading';
              })
              .addCase(getTeacherSubjectsByClassId.fulfilled, (state, action) => {
                state.fetchingStatus = 'succeeded';
                state.teacherSubjects = action.payload;
              })
              .addCase(getTeacherSubjectsByClassId.rejected, (state) => {
                state.fetchingStatus = 'failed';
              })

                 // get all subject with Classname

               .addCase(getAllSubjectWithClassname.pending, (state) => {
                state.fetchingStatus = 'loading';
              })
              .addCase(getAllSubjectWithClassname.fulfilled, (state, action) => {
                state.fetchingStatus = 'succeeded';
                state.subjectWithClassname = action.payload;
              })
              .addCase(getAllSubjectWithClassname.rejected, (state) => {
                state.fetchingStatus = 'failed';
              })

             // Fetching Subject By Id
          .addCase(getSubjectById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getSubjectById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
          })
          .addCase(getSubjectById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



             // Delete Subject By Id

            .addCase(deleteSubject.pending, (state) => {
              state.deletingStatus = 'loading';
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
              state.deletingStatus = 'succeeded';
              state.subjectsInClass = state.subjectsInClass.filter(subjects => subjects.id !== action.payload.id);
    
            })
            .addCase(deleteSubject.rejected, (state) => {
              state.deletingStatus = 'failed';
            })


            
             // update Subject

             .addCase(updateSubject.pending, (state) => {
              state.updateStatus = 'loading';
            })
           
             .addCase(updateSubject.fulfilled, (state, action) => {
              state.updateStatus = 'succeeded';
              const index = state.subjectsInClass.findIndex(subject => subject.id === action.payload.subjectDto.id);
               if (index !== -1) {
              state.subjectsInClass[index] = action.payload.subjectDto;
              }
              })
             .addCase(updateSubject.rejected, (state) => {
              state.updateStatus = 'failed';
            });
      },

});

export const { resetStatus } = subjectSlice.actions;
export default subjectSlice.reducer;