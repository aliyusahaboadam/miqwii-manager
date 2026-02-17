import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from 'api';
import api from '../../component/routing/Interceptor';

const BASE_URL = `${process.env.REACT_APP_API_URL}/v1/api/school`;


export const saveSchool = createAsyncThunk(
  'School/AddingSchool',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL + '/add', requestData);
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const getAuthSchool = createAsyncThunk(
  'class/getAuthSchool',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-auth-school`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSchoolWithBasicDetails = createAsyncThunk(
  'class/getSchoolWithBasicDetails',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-with-basic-details`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSchoolForPaymentDisplayById = createAsyncThunk(
  'class/getAuthSchoolForPaymentDisplay',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-with-payment-details-by-id/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSchoolById = createAsyncThunk(
  'class/getAuthSchool',
  async (id,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-by-id/${id}`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const uploadLogo = createAsyncThunk(
  'school/uploadLogo',
  async (logoData,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(BASE_URL + `/save-logo`, logoData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"multipart/form-data"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const updateSchool = createAsyncThunk(
  'school/updateSchool',
  async ({id, schoolData},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("From Inside Slice" + id);
      console.log("From Inside Slice" + schoolData);
      const response = await api.put(BASE_URL + `/update-school/${id}`, schoolData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const schoolActivator = createAsyncThunk(
  'school/schoolActivator',
  async ({id, activatorStatus},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("From Inside Slice" +  JSON.stringify(activatorStatus));
      const response = await api.put(BASE_URL + `/school-activator/${id}`,  activatorStatus, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const studentActivator = createAsyncThunk(
  'school/studentActivator',
  async ({id, activatorStatus},  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // console.log("From Inside Slice" +  JSON.stringify(activatorStatus));
      const response = await api.put(BASE_URL + `/student-activator/${id}`,  activatorStatus, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`, "Content-Type":"application/json"}});
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);





export const getAllSchoolCount = createAsyncThunk(
  'school/getAllSchoolCount',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-school-count`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getAllTeachersCount = createAsyncThunk(
  'school/getAllTeachersCount',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-teacher-count`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getAllStudentCount = createAsyncThunk(
  'school/getAllStudentCount',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-student-count`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getAllStudentCountMale = createAsyncThunk(
  'school/getAllStudentCountMale',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-student-count-male`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getAllStudentCountFemale = createAsyncThunk(
  'school/getAllStudentCountFemale',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-student-count-female`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getAllClassCountJss = createAsyncThunk(
  'school/getAllClassCountJss',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-class-count-jss`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getAllClassCountSss = createAsyncThunk(
  'school/getAllClassCountSss',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-class-count-sss`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getAllClassCountPri = createAsyncThunk(
  'school/getAllClassCountPri',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-class-count-pri`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);





export const getAllClassCountJssTeacher = createAsyncThunk(
  'school/getAllClassCountJssTeacher',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-class-count-jss-teachers`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);



export const getAllClassCountSssTeachers = createAsyncThunk(
  'school/getAllClassCountSssTeaches',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-class-count-sss-teachers`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const getAllClassCountPriTeachers = createAsyncThunk(
  'school/getAllClassCountPriTeachers',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-all-class-count-pri-teachers`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);


export const getSchoolAlongWithDetails = createAsyncThunk(
  'school/getSchoolAlongWithDetails',
  async (_,  { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(BASE_URL + `/get-school-along-with-details`,  { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
      console.log(JSON.stringify(response.data))
      return response.data; // Return the saved user response
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong"});
    }
  }
);




export const deleteSchool = createAsyncThunk(
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






const schoolSlice = createSlice({
    name: 'School',
    initialState: {
        schools: [],
        school: null,
        allSchoolCount: 0,
        allStudentCount: 0,
        allTeachersCount: 0,
        allStudentCountMale: 0,
        allStudentCountFamale: 0,
        allClassJssCount: 0,
        allClassSssCount: 0,
        allClassPriCount: 0,
        allClassTeachersPriCount: 0,
        allClassTeachersJssCount: 0,
        allClassTeachersSssCount: 0,
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
          .addCase(saveSchool.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(saveSchool.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
          })
          .addCase(saveSchool.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


            // disable all student entry
          .addCase(studentActivator.pending, (state) => {
            state.savingStatus = 'loading';
          })
          .addCase(studentActivator.fulfilled, (state, action) => {
            state.savingStatus = 'succeeded';
          })
          .addCase(studentActivator.rejected, (state) => {
            state.savingStatus = 'failed';
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




              // Get All School Count
          .addCase(getAllSchoolCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllSchoolCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allSchoolCount = action.payload;
          })
          .addCase(getAllSchoolCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })




               // Get All Student Count
          .addCase(getAllStudentCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllStudentCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allStudentCount = action.payload;
          })
          .addCase(getAllStudentCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



               // Get All Teacher Count
          .addCase(getAllTeachersCount.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllTeachersCount.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allTeachersCount = action.payload;
          })
          .addCase(getAllTeachersCount.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })




              // Get All Student Count Male
          .addCase(getAllStudentCountMale.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllStudentCountMale.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allStudentCountMale = action.payload;
          })
          .addCase(getAllStudentCountMale.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


             // Get All Student Count Female
          .addCase(getAllStudentCountFemale.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllStudentCountFemale.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allStudentCountFamale = action.payload;
          })
          .addCase(getAllStudentCountFemale.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })


            // Get All class count PRI
          .addCase(getAllClassCountPri.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllClassCountPri.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allClassPriCount = action.payload;
          })
          .addCase(getAllClassCountPri.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



             // Get All class count JSS
          .addCase(getAllClassCountJss.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllClassCountJss.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allClassJssCount = action.payload;
          })
          .addCase(getAllClassCountJss.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



          
             // Get All class count SSS
          .addCase(getAllClassCountSss.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllClassCountSss.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allClassSssCount = action.payload;
          })
          .addCase(getAllClassCountSss.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



            // Get All class count Primary Teachers
          .addCase(getAllClassCountPriTeachers.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllClassCountPriTeachers.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allClassTeachersPriCount = action.payload;
          })
          .addCase(getAllClassCountPriTeachers.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



            // Get All class count JSS Teachers
          .addCase(getAllClassCountJssTeacher.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllClassCountJssTeacher.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allClassTeachersJssCount = action.payload;
          })
          .addCase(getAllClassCountJssTeacher.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



          // Get All class count SSS Teachers
          .addCase(getAllClassCountSssTeachers.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getAllClassCountSssTeachers.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.allClassTeachersSssCount = action.payload;
          })
          .addCase(getAllClassCountSssTeachers.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



             // Get All School With Details (ADMIN)
          .addCase(getSchoolAlongWithDetails.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getSchoolAlongWithDetails.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.schools = action.payload;
          })
          .addCase(getSchoolAlongWithDetails.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



           // Get All School With Details
          .addCase(getSchoolWithBasicDetails.pending, (state) => {
            state.fetchingStatus = 'loading';
          })
          .addCase(getSchoolWithBasicDetails.fulfilled, (state, action) => {
            state.fetchingStatus = 'succeeded';
            state.school = action.payload;
          })
          .addCase(getSchoolWithBasicDetails.rejected, (state) => {
            state.fetchingStatus = 'failed';
          })



          // deleting school
          
                    .addCase(deleteSchool.pending, (state) => {
                      state.deletingStatus = 'loading';
                    })
                    .addCase(deleteSchool.fulfilled, (state, action) => {
                      state.deletingStatus = 'succeeded';
                      state.schools = state.schools.filter(school => school.id !== action.payload.id);
                    })
                    .addCase(deleteSchool.rejected, (state) => {
                      state.deletingStatus = 'failed';
                    })



                     // upload file
          
                    .addCase(uploadLogo.pending, (state) => {
                      state.savingStatus = 'loading';
                    })
                    .addCase(uploadLogo.fulfilled, (state, action) => {
                      state.savingStatus = 'succeeded';
                    })
                    .addCase(uploadLogo.rejected, (state) => {
                      state.savingStatus = 'failed';
                    })


                     // activator update
                                
                                
                                          .addCase(schoolActivator.pending, (state) => {
                                            state.updateStatus = 'loading';
                                          })
                                          .addCase(schoolActivator.fulfilled, (state, action) => {
                                            const index = state.schools.findIndex(user => user.id === action.payload.schoolDto.id);
                                            if (index !== -1) {
                                              // Replace the old user object with the updated one
                                              state.schools[index] = action.payload.schoolDto;
                                            }
                                            state.updateStatus = 'succeeded';
                                          })
                                          .addCase(schoolActivator.rejected, (state) => {
                                            state.updateStatus = 'failed';
                                          })


            //


              // Update Status
                                
                                
                                          .addCase(updateSchool.pending, (state) => {
                                            state.updateStatus = 'loading';
                                          })
                                          .addCase(updateSchool.fulfilled, (state, action) => {
                                            const index = state.schools.findIndex(user => user.id === action.payload.schoolDto.id);
                                            if (index !== -1) {
                                              // Replace the old user object with the updated one
                                              state.schools[index] = action.payload.schoolDto;
                                            }
                                            state.updateStatus = 'succeeded';
                                          })
                                          .addCase(updateSchool.rejected, (state) => {
                                            state.updateStatus = 'failed';
                                          });




                                          
            
                        
          


      },
});


export default schoolSlice.reducer;