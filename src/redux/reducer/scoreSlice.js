import { Construction } from '@mui/icons-material';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';
import MasterSheet from '../../component/result/MasterSheet';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/score`;

export const saveScore = createAsyncThunk(
  'score/saveScore',
  async (studentsScore, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/add-score`, studentsScore, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);





export const getStudentScores = createAsyncThunk(
  'score/getStudentScore',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-scores/${id}`, {}, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
    
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);






export const getScoreInputState = createAsyncThunk(
  'score/getScoreInputState',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-input-state`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});

      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getScoreByClassIdAndSubjectId = createAsyncThunk(
  'score/getScoreByClassIdAndSubjectId',
  async ({subjectId, classId},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-score-by-classId-and-subjectId/${subjectId}/${classId}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});

      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getScoreById = createAsyncThunk(
  'score/getScoreById',
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


export const getResultByClassId = createAsyncThunk(
  'score/getResultByClassId',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-results/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getMasterSheetByClassId = createAsyncThunk(
  'score/getMasterSheetByClassId',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-mastersheet/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getResultByAuthStudent = createAsyncThunk(
  'score/getResultByStudentId',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-results-by-auth-student`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getResultByStudentRegNo = createAsyncThunk(
  'score/getResultByStudentRegNo',
  async (requestData,  { rejectWithValue }) => {
    
    try {
   
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/get-results-by-regNo`, requestData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);






export const deleteStudentScore = createAsyncThunk(
  'score/deleteStudentScore ',
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



export const updateScore = createAsyncThunk(
  'score/updateScore',
  async ({id, scoreData},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, scoreData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




const scoreSlice = createSlice({
    name: 'subjects',
    initialState: {
        scores: [],
        studentScore: [],
        results: [],
        masterSheet: [],
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        deletingStatus: 'idle',
        updateStatus: 'idle',
        existsStatus: 'idle',
        error: null,
    },
    reducers: {
   
    },
    extraReducers: (builder) => {
        builder
          .addCase(saveScore.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveScore.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(saveScore.rejected, (state) => {
            state.savingStatus = 'failed';
          })

           // get sstudent score by class

          .addCase(getStudentScores.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getStudentScores.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.studentScore = action.payload;
          })
          .addCase(getStudentScores.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


               // get Result by class id

          .addCase(getResultByClassId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getResultByClassId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.results = action.payload;
          })
          .addCase(getResultByClassId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



               // get mastersheet by class id

          .addCase(getMasterSheetByClassId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getMasterSheetByClassId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.masterSheet = action.payload;
          })
          .addCase(getMasterSheetByClassId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })





                    // get Result By Auth Student

          .addCase(getResultByAuthStudent.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getResultByAuthStudent.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.results = action.payload;
          })
          .addCase(getResultByAuthStudent.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


          
                    // get Result By Reg No

          .addCase(getResultByStudentRegNo.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getResultByStudentRegNo.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
           state.results = action.payload;
          })
          .addCase(getResultByStudentRegNo.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



           .addCase(getScoreByClassIdAndSubjectId.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getScoreByClassIdAndSubjectId.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
           state.scores = action.payload;
          })
          .addCase(getScoreByClassIdAndSubjectId.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

              // Fetching Subject By Id
          .addCase(getScoreById.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getScoreById.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
          })
          .addCase(getScoreById.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


          
        



             // Delete Subject By Id

            .addCase(deleteStudentScore.pending, (state) => {
              state.deletingStatus = 'loading';
            })
            .addCase(deleteStudentScore.fulfilled, (state, action) => {
              state.deletingStatus = 'succeeded';
              state.studentScore = state.studentScore.filter(scores => scores.id !== action.payload.id);
    
            })
            .addCase(deleteStudentScore.rejected, (state) => {
              state.deletingStatus = 'failed';
            })


            
             // update Subject

             .addCase(updateScore.pending, (state) => {
              state.updateStatus = 'loading';
            })
           
             .addCase(updateScore.fulfilled, (state, action) => {
              state.updateStatus = 'succeeded';
              const index = state.studentScore.findIndex(score => score.id === action.payload.scoreDto.id);
               if (index !== -1) {
              state.studentScore[index] = action.payload.scoreDto;
              }
              })
             .addCase(updateScore.rejected, (state) => {
              state.updateStatus = 'failed';
            });
      },

});


export default scoreSlice.reducer;