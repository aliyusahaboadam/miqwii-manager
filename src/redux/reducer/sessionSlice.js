import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/session`;


export const saveSession = createAsyncThunk(
  'session/AddSession',
  async (requestData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', requestData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);






export const setCurrentSession = createAsyncThunk(
  'session/setCurrentSession',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + '/set-current', id , { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
  
      return response.data; // Return the saved user response
      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const updateSession = createAsyncThunk(
  'session/updateSession',
  async (sessionData,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/update-session', sessionData , { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data; // Return the saved user response
      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getAllSession = createAsyncThunk(
  'session/getAllSession',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getSessionDashboardDetails = createAsyncThunk(
  'session/getSessionDashboardDetails',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-session-dashboard-details`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getCurrentSession = createAsyncThunk(
  'session/getCurrentSession',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-current-session`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const sessionSlice = createSlice({
    name: 'Session',
    initialState: {
        sessions: [],
        session: null,
        sessionDetails: null,
        savingStatus: 'idle',
        fetchingStatus: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        
          // save session

          .addCase(saveSession.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveSession.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
         
          })
          .addCase(saveSession.rejected, (state) => {
            state.savingStatus = 'failed';
          })

               // get All Session
            
           .addCase(getAllSession.pending, (state) => {
                state.fetchingStatus = 'loading';
              })
              .addCase(getAllSession.fulfilled, (state, action) => {
                state.fetchingStatus = 'succeeded';
                state.sessions = action.payload;
              })
              .addCase(getAllSession.rejected, (state) => {
                state.fetchingStatus = 'failed';
              })





                 // get Session Details
            
           .addCase(getSessionDashboardDetails.pending, (state) => {
                state.fetchingStatus = 'loading';
              })
              .addCase(getSessionDashboardDetails.fulfilled, (state, action) => {
                state.fetchingStatus = 'succeeded';
                state.sessionDetails = action.payload;
              })
              .addCase(getSessionDashboardDetails.rejected, (state) => {
                state.fetchingStatus = 'failed';
              })



                 // get Current Session
            
           .addCase(getCurrentSession.pending, (state) => {
                state.fetchingStatus = 'loading';
              })
              .addCase(getCurrentSession.fulfilled, (state, action) => {
                state.fetchingStatus = 'succeeded';
                state.session = action.payload;
              })
              .addCase(getCurrentSession.rejected, (state) => {
                state.fetchingStatus = 'failed';
              })



                  // get Session by ID

          .addCase(setCurrentSession.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(setCurrentSession.fulfilled, (state, action) => {
            const index = state.sessions.findIndex(session => session.id === action.payload.id);
            console.log("from inside add case" + action.payload)
              if (index !== -1) {
              //  the logic for the update here
               // First, loop through and set all to false
              state.sessions.forEach(session => {
                session.current = false;
              });
              state.sessions[index].current = true;
            }
            state.fetchingStatus = 'succeeded';
            // here will be the logic of the update 
          })
          .addCase(setCurrentSession.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })
      },
});


export default sessionSlice.reducer;