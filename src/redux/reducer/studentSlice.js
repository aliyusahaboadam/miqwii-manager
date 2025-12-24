import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/student`;

export const saveStudent = createAsyncThunk(
  'student/saveStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + '/add', studentData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const allStudentCount = createAsyncThunk(
  'student/allStudentCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/all-students-count',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);














export const getStudentsWithBasicDetailsByClassId = createAsyncThunk(
  'student/getStudentsWithBasicDetailsByClassId',
  async (classId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/students-with-basic-details/${classId}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response

    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const maleStudentCountInClass = createAsyncThunk(
  'student/maleStudentCountInClass',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/males-students-count-in-class/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});

      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);





export const getStudentCountDetailsByClass = createAsyncThunk(
  'student/getStudentCountDetailsByClass',
  async (classId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/student-count-details-by-class/${classId}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
     
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const updateStudent = createAsyncThunk(
  'class/updateStudent',
  async ({id, studentData},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(BASE_URL + `/update/${id}`, studentData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getStudentByClass = createAsyncThunk(
  'class/getStudentInClass',
  async (name,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/class/${name}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);





export const getStudentsByClassId = createAsyncThunk(
  'class/getStudentInClassId',
  async (classId,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/all-students-by-classId/${classId}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getAuthenticatedStudentById = createAsyncThunk(
  'teacher/getAuthenticatedStudentById',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-authenticated-student-by-id`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getStudentCountDetails = createAsyncThunk(
  'student/getStudentCountDetails',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/student-count-details`, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getStudentRegNo = createAsyncThunk(
  'class/getStudentByRegNo',
  async (regNo,  { rejectWithValue }) => {
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/get-by-regNo`, regNo,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getStudentById = createAsyncThunk(
  'class/getStudentById',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-by-id/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const deleteStudent = createAsyncThunk(
  'Student/deleteStudent',
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


const studentSlice = createSlice({
    name: 'student',
    initialState: {
        students: [],
        student: null,
        studentCountDetails: null,
        studentCountDetailsByClass: null,
        studentsInClass: [],
        studentsInClassByClassId: [],
        allStudent: 0,
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
          .addCase(saveStudent.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(saveStudent.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
            state.students = action.payload;
          })
          .addCase(saveStudent.rejected, (state) => {
            state.savingStatus = 'failed';
          })

          // deleting student

          .addCase(deleteStudent.pending, (state) => {
            state.deletingStatus = 'loading';
          })
          .addCase(deleteStudent.fulfilled, (state, action) => {
            state.deletingStatus = 'succeeded';
            state.studentsInClass = state.studentsInClass.filter(student => student.id !== action.payload.id);
          })
          .addCase(deleteStudent.rejected, (state) => {
            state.deletingStatus = 'failed';
          })
              


                     // Student in a class

                     .addCase(getStudentByClass.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(getStudentByClass.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.studentsInClass = action.payload;
                    })
                    .addCase(getStudentByClass.rejected, (state) => {
                      state.fetchingStatus = 'failed';
                    })



                       // Student in a class by classId

                     .addCase(getStudentsByClassId.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(getStudentsByClassId.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.studentsInClassByClassId = action.payload;
                    })
                    .addCase(getStudentsByClassId.rejected, (state) => {
                      state.fetchingStatus = 'failed';
                    })


                    // STudent with Basic Details 

                     .addCase(getStudentsWithBasicDetailsByClassId.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(getStudentsWithBasicDetailsByClassId.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.studentsInClassByClassId = action.payload;
                    })
                    .addCase(getStudentsWithBasicDetailsByClassId.rejected, (state) => {
                      state.fetchingStatus = 'failed';
                    })


               // Get Authenticated Student By Id
                        
                          .addCase(getAuthenticatedStudentById.pending, (state) => {
                            state.fetchingStatus = 'loading';
                          })
                          .addCase(getAuthenticatedStudentById.fulfilled, (state, action) => {
                            state.fetchingStatus = 'succeeded';
                            state.student = action.payload;
                            
                          })
                          .addCase(getAuthenticatedStudentById.rejected, (state) => {
                            state.fetchingStatus = 'failed';
                          })




                          // Get Student Count Details
                        
                          .addCase(getStudentCountDetails.pending, (state) => {
                            state.fetchingStatus = 'loading';
                          })
                          .addCase(getStudentCountDetails.fulfilled, (state, action) => {
                            state.fetchingStatus = 'succeeded';
                            state.studentCountDetails = action.payload;
                            
                          })
                          .addCase(getStudentCountDetails.rejected, (state) => {
                            state.fetchingStatus = 'failed';
                          })



                          // Get Student Count Details
                        
                          .addCase(getStudentCountDetailsByClass.pending, (state) => {
                            state.fetchingStatus = 'loading';
                          })
                          .addCase(getStudentCountDetailsByClass.fulfilled, (state, action) => {
                            state.fetchingStatus = 'succeeded';
                            state.studentCountDetailsByClass = action.payload;
                            
                          })
                          .addCase(getStudentCountDetailsByClass.rejected, (state) => {
                            state.fetchingStatus = 'failed';
                          })
              
              





                    // All Student Count

                    .addCase(allStudentCount.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(allStudentCount.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.allStudent = action.payload;
                    })
                    .addCase(allStudentCount.rejected, (state) => {
                      state.fetchingStatus = 'failed';
                    })


       

              








                    // get Student 

                    .addCase(getStudentRegNo.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(getStudentRegNo.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                     
                    })
                    .addCase(getStudentRegNo.rejected, (state) => {
                      state.fetchingStatus= 'failed';
                    })


                         // get Student By Id

                         .addCase(getStudentById.pending, (state) => {
                          state.fetchingStatus = 'loading';
                        })
                        .addCase(getStudentById.fulfilled, (state, action) => {
                          state.fetchingStatus = 'succeeded';
                        })
                        .addCase(getStudentById.rejected, (state) => {
                          state.fetchingStatus= 'failed';
                        })



                    
                              // Update Status
                    
                    
                              .addCase(updateStudent.pending, (state) => {
                                state.updateStatus = 'loading';
                              })
                              .addCase(updateStudent.fulfilled, (state, action) => {
                                const index = state.studentsInClass.findIndex(user => user.id === action.payload.studentDto.id);
                                if (index !== -1) {
                                  // Replace the old user object with the updated one
                                  state.studentsInClass[index] = action.payload.studentDto;
                                }
                                state.updateStatus = 'succeeded';
                              })
                              .addCase(updateStudent.rejected, (state) => {
                                state.updateStatus = 'failed';
                              });


      },



});

export const { resetStatus } = studentSlice.actions;
export default studentSlice.reducer;