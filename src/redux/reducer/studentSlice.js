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


export const maleStudentCount = createAsyncThunk(
  'student/maleStudentCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/males-students-count',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const femaleStudentCount = createAsyncThunk(
  'student/FemaleStudentCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + '/females-students-count',  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);






export const allStudentCountInClass = createAsyncThunk(
  'student/allStudentCountInClassInClass',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/all-students-count-in-class/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
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


export const femaleStudentCountInClass = createAsyncThunk(
  'student/FemaleStudentCountInClass',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/females-students-count-in-class/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
     
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
      const response = await api.get(BASE_URL + `/get-authenticated-student-by-id`,{ headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
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
        studentsInClass: [],
        studentsInClassByClassId: [],
        allStudent: 0,
        maleStudent: 0,
        femaleStudent: 0,
        allStudentInClass: 0,
        maleStudentInClass: 0,
        femaleStudentInClass: 0,
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


          // male Student Count

          .addCase(maleStudentCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(maleStudentCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.maleStudent = action.payload;
          })
          .addCase(maleStudentCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

                     // Female Student Count

                     .addCase(femaleStudentCount.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(femaleStudentCount.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.femaleStudent = action.payload;
                    })
                    .addCase(femaleStudentCount.rejected, (state) => {
                      state.fetchingStatus= 'failed';
                    })





                    // All Student Count in class

                    .addCase(allStudentCountInClass.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(allStudentCountInClass.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.allStudentInClass = action.payload;
                    })
                    .addCase(allStudentCountInClass.rejected, (state) => {
                      state.fetchingStatus = 'failed';
                    })


          // male Student Count in class

          .addCase(maleStudentCountInClass.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(maleStudentCountInClass.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.maleStudentInClass = action.payload;
          })
          .addCase(maleStudentCountInClass.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })

                     // Female Student Count in class

                     .addCase(femaleStudentCountInClass.pending, (state) => {
                      state.fetchingStatus = 'loading';
                    })
                    .addCase(femaleStudentCountInClass.fulfilled, (state, action) => {
                      state.fetchingStatus = 'succeeded';
                      state.femaleStudentInClass = action.payload;
                    })
                    .addCase(femaleStudentCountInClass.rejected, (state) => {
                      state.fetchingStatus= 'failed';
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