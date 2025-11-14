import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';


const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/payment`;

export const savePayment = createAsyncThunk(
  'payment/savePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', paymentData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const getAuthSchool = createAsyncThunk(
  'payment/getAuthSchool',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-auth-school`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify("Dowara " + response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getPayments = createAsyncThunk(
  'payment/getPayment',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-payments`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getExpiryDate = createAsyncThunk(
  'payment/getExpiryDate',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-expiry-date`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




const paymentSlice = createSlice({
    name: 'School',
    initialState: {
        payments: [],
        schools: [],
        expiryDate: "",
        school: null,
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
          .addCase(savePayment.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(savePayment.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
          })
          .addCase(savePayment.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

                // GET AUTH SCHOOL
          .addCase(getAuthSchool.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAuthSchool.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.school = action.payload;
          })
          .addCase(getAuthSchool.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



                    // GET PAYMENTS 
          .addCase(getPayments.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getPayments.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.payments = action.payload;
          })
          .addCase(getPayments.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


          
                    // GET expiry Date
          .addCase(getExpiryDate.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getExpiryDate.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.expiryDate = action.payload;
          })
          .addCase(getExpiryDate.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })
      },
});


export default paymentSlice.reducer;