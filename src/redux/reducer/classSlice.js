import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/class`;

export const getClassNames = createAsyncThunk(
  'class/getClassNames',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-class-names',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getAllClass = createAsyncThunk(
  'class/getAllClass',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-all',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getAllClassnameAndId = createAsyncThunk(
  'class/getAllClassnameAndId',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-classname-and-id',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getAllClassnameAndSubjectCount = createAsyncThunk(
  'class/getAllClassnameAndSubjectCount',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-classname-and-subjectcount',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getPrefixClassnameAndBasicDetails = createAsyncThunk(
  'class/getPrefixClassnameAndBasicDetails',
  async (prefix,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-prefix-classes-with-basic-datails/${prefix}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getClassCount = createAsyncThunk(
  'class/getClassCount',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-class-count',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getTeacherOwnedClass = createAsyncThunk(
  'class/getTeacherOwnedClass',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/get-teacher-classes',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
         console.log("from inside the slice" + JSON.stringify(response.data));
      return response.data; // Return the saved user response
   
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getClassNamesStartingWith = createAsyncThunk(
  'class/getClassNamesStartingWith',
  async (prefix,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-class-names/${prefix}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getClassChart = createAsyncThunk(
  'class/getClassChart',
  async (prefix,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-class-chart`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);





export const getClassCountSpecific = createAsyncThunk(
  'class/getClassCountSpecific',
  async (prefix,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-class-count-specific/${prefix}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getClass = createAsyncThunk(
  'class/getClass',
  async (name,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get/${name}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const updateClass = createAsyncThunk(
  'class/updateClass',
  async ({classData, className},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${className}`, classData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const saveClass = createAsyncThunk(
  'class/saveClass',
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


export const classExists = createAsyncThunk(
  'class/checkClass',
  async ( data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/check-class-exists', { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const deleteClass = createAsyncThunk(
  'class/deleteClass',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(BASE_URL + `/delete/${id}`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


const classSlice = createSlice({
    name: 'class',
    initialState: {
        classes: [],
        classNames: [],
        classNamesSpecific: [],
        chartCounts: { PRI: [], NUR: [], JSS: [], SSS: [] },
        classesOwnedByTeacher: [],
        classCount: 0,
        classCountSpecific: 0,
        classExist: null,
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

        // fetch class names
          .addCase(getClassNames.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getClassNames.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.classNames = action.payload;
          })
          .addCase(getClassNames.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


                // fetch all class
                .addCase(getAllClass.pending, (state) => {
                  state.fetchingStatus = 'loading';
                })
                .addCase(getAllClass.fulfilled, (state, action) => {
                  state.fetchingStatus = 'succeeded';
                  state.classes = action.payload;
                })
                .addCase(getAllClass.rejected, (state) => {
                  state.fetchingStatus = 'failed';
                })


              // get classname and id
                 .addCase(getAllClassnameAndId.pending, (state) => {
                  state.fetchingStatus = 'loading';
                })
                .addCase(getAllClassnameAndId.fulfilled, (state, action) => {
                  state.fetchingStatus = 'succeeded';
                  state.classes = action.payload;
                })
                .addCase(getAllClassnameAndId.rejected, (state) => {
                  state.fetchingStatus = 'failed';
                })




                    // get classname with Students with Basic Details
                 .addCase(getPrefixClassnameAndBasicDetails.pending, (state) => {
                  state.fetchingStatus = 'loading';
                  state.classNamesSpecific = []; // Clear old data immediately
                })
                .addCase(getPrefixClassnameAndBasicDetails.fulfilled, (state, action) => {
                  state.fetchingStatus = 'succeeded';
                  state.classNamesSpecific = action.payload;
                })
                .addCase(getPrefixClassnameAndBasicDetails.rejected, (state) => {
                  state.fetchingStatus = 'failed';
                })





                // get classname and subject count
                 .addCase(getAllClassnameAndSubjectCount.pending, (state) => {
                  state.fetchingStatus = 'loading';
                })
                .addCase(getAllClassnameAndSubjectCount.fulfilled, (state, action) => {
                  state.fetchingStatus = 'succeeded';
                  state.classes = action.payload;
                })
                .addCase(getAllClassnameAndSubjectCount.rejected, (state) => {
                  state.fetchingStatus = 'failed';
                })


                    // getTeacher Owned Class
                .addCase(getTeacherOwnedClass.pending, (state) => {
                  state.fetchingStatus = 'loading';
                })
                .addCase(getTeacherOwnedClass.fulfilled, (state, action) => {
                  state.fetchingStatus = 'succeeded';
                  state.classesOwnedByTeacher = action.payload;
                })
                .addCase(getTeacherOwnedClass.rejected, (state) => {
                  state.fetchingStatus = 'failed';
                })


          .addCase(getClassNamesStartingWith.pending, (state) => {
            state.fetchingStatus = 'loading';
            state.classNamesSpecific = []; // Clear old data immediately
          })
          .addCase(getClassNamesStartingWith.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.classNamesSpecific = action.payload;
          })
          .addCase(getClassNamesStartingWith.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })




           .addCase(getClassChart.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getClassChart.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.chartCounts = action.payload;
          })
          .addCase(getClassChart.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })




          

          .addCase(getClassCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getClassCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.classCount = action.payload;
          })
          .addCase(getClassCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


          
          .addCase(getClassCountSpecific.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getClassCountSpecific.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.classCountSpecific = action.payload;
          })
          .addCase(getClassCountSpecific.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })
          
          // Save Class
          
          .addCase(saveClass.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveClass.fulfilled, (state, action) => {
            state.classNamesSpecific = action.payload.classDto;
            state.savingStatus = 'succeeded';
          })
          .addCase(saveClass.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // delete class

          .addCase(deleteClass.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deleteClass.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.classNamesSpecific = state.classNamesSpecific.filter(classes => classes.id !== action.payload.id);
          })
          .addCase(deleteClass.rejected, (state) => {
            state.deletingStatus = 'failed';
          })

          // check class exist


          .addCase(classExists.pending, (state) => {
            state.existsStatus = 'loading';
          })
          .addCase(classExists.fulfilled, (state, action) => {
            state.existsStatus = 'succeeded';
          })
          .addCase(classExists.rejected, (state) => {
            state.existsStatus = 'failed';
          })



          
          // get Class


          .addCase(getClass.pending, (state) => {
            state.getStatus = 'loading';
          })
          .addCase(getClass.fulfilled, (state, action) => {
            state.getStatus = 'succeeded';
          })
          .addCase(getClass.rejected, (state) => {
            state.getStatus = 'failed';
          })



          
          // Update Status


          .addCase(updateClass.pending, (state) => {
            state.updateStatus = 'loading';
          })
          .addCase(updateClass.fulfilled, (state, action) => {
            const index = state.classNamesSpecific.findIndex(user => user.id === action.payload.classDto.id);
            if (index !== -1) {
              // Replace the old user object with the updated one
              state.classNamesSpecific[index] = action.payload.classDto;
            }
            state.updateStatus = 'succeeded';
          })
          .addCase(updateClass.rejected, (state) => {
            state.updateStatus = 'failed';
          });
      },



});


export default classSlice.reducer;