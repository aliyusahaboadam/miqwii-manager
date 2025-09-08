import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/receipt`;



export const saveReceipt = createAsyncThunk(
  'receipt/savePaidReceipt',
  async (studentId,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/save-checked-receipt/${studentId}`, {}, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log("from inside receipt slice: " + JSON.stringify(response.data));
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getStudentByClassForReceipt = createAsyncThunk(
  'class/getStudentInClassForRecipt',
  async (name,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-fee-class/${name}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const unCheckAllReceipt = createAsyncThunk(
  'receipt/unCheckAllReceipt',
  async (name,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/uncheck-all/${name}`, {}, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const saveReci = createAsyncThunk(
  'class/saveReceipt',
  async (classData,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', classData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const receiptSlice = createSlice({
    name: 'receipt',
    initialState: {
        receipt: [],
        studentsInClass: [],
        paidCount: 0,
        unpaidCount: 0,
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


          // Student in a class
          
                               .addCase(getStudentByClassForReceipt.pending, (state) => {
                                state.fetchingStatus = 'loading';
                              })
                              .addCase(getStudentByClassForReceipt.fulfilled, (state, action) => {
                                state.fetchingStatus = 'succeeded';
                                state.studentsInClass = action.payload;
                              })
                              .addCase(getStudentByClassForReceipt.rejected, (state) => {
                                state.fetchingStatus = 'failed';
                              })

        


    // Uncheck ALl receipt
          
                               .addCase(unCheckAllReceipt.pending, (state) => {
                                state.fetchingStatus = 'loading';
                              })
                              .addCase(unCheckAllReceipt.fulfilled, (state, action) => {
                                state.fetchingStatus = 'succeeded';
                                state.studentsInClass = action.payload;
                              })
                              .addCase(unCheckAllReceipt.rejected, (state) => {
                                state.fetchingStatus = 'failed';
                              })
          
        
      

          
          // Save Receipt


          .addCase(saveReceipt.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(saveReceipt.fulfilled, (state, action) => {
            const index = state.studentsInClass.findIndex(user => user.id === action.payload.feeDto.id);
            if (index !== -1) {
              // Replace the old user object with the updated one
              state.studentsInClass[index] = action.payload.feeDto;
            }
            state.updateStatus = 'succeeded';
          })
          .addCase(saveReceipt.rejected, (state) => {
            state.updateStatus = 'failed';
          })
          
      },



});


export default receiptSlice.reducer;