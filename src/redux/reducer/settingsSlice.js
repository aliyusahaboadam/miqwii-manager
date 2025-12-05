import { Construction } from '@mui/icons-material';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/settings`;



export const changePositioningState= createAsyncThunk(
  'settings/changePositioningState',
  async (enable,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/change-positioning/${enable}`, {} , { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
    
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);

export const changeInputStateFirstCA = createAsyncThunk(
  'settings/changeInputStateFirstCA',
  async (enable,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/change-1stCA-state/${enable}`, {} , { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
    
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);





export const changeInputStateSecondCA = createAsyncThunk(
  'settings/changeInputStateSecondCA',
  async (enable,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/change-2ndCA-state/${enable}`, {}, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
    
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);

export const changeInputStateExam = createAsyncThunk(
  'settings/changeInputStateExam',
  async (enable,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/change-exam-state/${enable}`, {}, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});

      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSettingsState = createAsyncThunk(
  'settings/getSettingsState',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-settings-state`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});

      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        disableScoreInputFirstCA: true,
        disableScoreInputSecondCA: true,
        disableScoreInputExam: true,
        disablePositioning: true,
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
         

          .addCase(changePositioningState.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(changePositioningState.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.disableScoreInputFirstCA = action.payload.disabledFirstCA;
            state.disableScoreInputSecondCA = action.payload.disabledSecondCA;
            state.disableScoreInputExam = action.payload.disabledExam;
            state.disablePositioning = action.payload.disabledPositioning;
          })
          .addCase(changePositioningState.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })
              // enable score input for first C.A
            .addCase(changeInputStateFirstCA.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(changeInputStateFirstCA.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.disableScoreInputFirstCA = action.payload.disabledFirstCA;
            state.disableScoreInputSecondCA = action.payload.disabledSecondCA;
            state.disableScoreInputExam = action.payload.disabledExam;
            state.disablePositioning = action.payload.disabledPositioning;
          })
          .addCase(changeInputStateFirstCA.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

    // enable score input for second C.A
            .addCase(changeInputStateSecondCA.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(changeInputStateSecondCA.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.disableScoreInputFirstCA = action.payload.disabledFirstCA;
            state.disableScoreInputSecondCA = action.payload.disabledSecondCA;
            state.disableScoreInputExam = action.payload.disabledExam;
            state.disablePositioning = action.payload.disabledPositioning;
          })
          .addCase(changeInputStateSecondCA.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })
           
         // enable score input for Exam C.A
            .addCase(changeInputStateExam.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(changeInputStateExam.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.disableScoreInputFirstCA = action.payload.disabledFirstCA;
            state.disableScoreInputSecondCA = action.payload.disabledSecondCA;
            state.disableScoreInputExam = action.payload.disabledExam;
            state.disablePositioning = action.payload.disabledPositioning;
          })
          .addCase(changeInputStateExam.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


             
             // get Score input state
          .addCase(getSettingsState.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getSettingsState.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.disableScoreInputFirstCA = action.payload.disabledFirstCA;
            state.disableScoreInputSecondCA = action.payload.disabledSecondCA;
            state.disableScoreInputExam = action.payload.disabledExam;
            state.disablePositioning = action.payload.disabledPositioning;
          })
          .addCase(getSettingsState.rejected, (state) => {
            state.fetchingStatus = 'failed';
          });
      },

});


export default settingsSlice.reducer;