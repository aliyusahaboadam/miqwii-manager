import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import { lazy, useState } from 'react';
import TextField from '@mui/material/TextField';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import {IconButton, InputAdornment, Checkbox } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import { Alert, Snackbar } from "@mui/material";
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import { getClassNames, classExists } from '../../redux/reducer/classSlice';
import { useDispatch, useSelector } from 'react-redux';
import { saveTeacher, resetStatus } from '../../redux/reducer/teacherSlice';
import { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { getAllSubject, getAllSubjectWithClassname } from '../../redux/reducer/subjectSlice';
import { useLocation, useNavigate } from 'react-router-dom';
// Import for dashboard Below

import React from "react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import { Menu as MenuIcon, Close as CloseIcon, Cancel } from "@mui/icons-material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';


import { 
  Drawer,  
  List, 
  Toolbar, 
  AppBar, 
  Box, 
  Typography, 
  CssBaseline,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: '550px',
  maxHeight: '77vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        borderRadius: '10px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));


const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: 'rgba(10, 40, 89)',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='251' height='251' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%230E387A' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%230E387A'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));



const AddTeacher = () => {

    const theme = useTheme();
          const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
          const [isDrawerOpen, setDrawerOpen] = useState(false);
          const [anchorProfile, setAnchorProfile] = React.useState(null);
          const [activeChevron, setActiveChevron] = useState(null);
        
          const toggleChevron = (chevronId) => {
            setActiveChevron((prev) => (prev === chevronId ? null : chevronId));
          };
        
          const toggleDrawer = () => {
            setDrawerOpen(!isDrawerOpen);
          };
        
          const profilePopup  = (event) => {
            setAnchorProfile(anchorProfile ? null : event.currentTarget);
          };
        
          const openProfile = Boolean(anchorProfile);
          const idProfile = openProfile ? 'simple-popper' : undefined;
        
          const handleClickAway = () => {
              setAnchorProfile(null);
          };
        
        
          // ABOVE IS DRAWER LOGIC BELOW IS THE APP LOGIC.........................................................................................
        

  const teacherRegistrationSchema = object({
    firstname: string().max(15, "Firstname must not exceed 15 characters")
              .required("Firstname is required"),

    surname: string().max(15, "Surname must not exceed 15 characters")
    .required("Surname is required"),
    
     
    lastname: string().max(15, "Lastname must not exceed 15 characters"),
    
    classes: array().of(string())
    .min(1, "Please select at least one class")
    .required("Class are required"),

  subjects: array().of(object())
      .min(1, "Please select at least one subject")
      .required("Subjects are required"),
   
  });
  


const [open, setOpen] = useState(false); 
const [alertType, setAlertType] = useState(""); 
const [message, setMessage] = useState(""); 
const studentState = useSelector((state) => state.students);
const classState = useSelector((state) => state.classes);
const { status: teacherStatus, error: teacherError } = studentState;
const { classNames: classNames, fetchingStatus: classFetchingStatus, status: classStatus, error: classError } = classState;
const dispatch = useDispatch();
const subjectState = useSelector((state) => state.subjects);
const { subjectWithClassname } = subjectState;
const location = useLocation();
const navigate = useNavigate();



const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}

useEffect(() =>  {

  fetchData();
  
}, [location.pathname]);


  async function fetchData() {
    const result = await dispatch(classExists()).unwrap();
    if (result.message === false) {
      setAlertType("error");
      setMessage("No class found, provide classes for this school in the class section");
      setOpen(true)
    } else if (result.message === true) {
    if (classFetchingStatus === 'idle') {
     dispatch(getClassNames());
     dispatch(getAllSubjectWithClassname());

   }
    }
  }

const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return;
  }
  setOpen(false);
};

  
     const handleFormSubmit = async (values, { resetForm })  => {
          
          const anonymousRequest = {
              teacher: {
                firstname: values.firstname,
                surname: values.surname,
                lastname: values.lastname,
                regNo: values.regNo,
                entryDate: values.entryDate,
                user: values.user,
                subjects: values.subjects,
              },
               classNames: values.classes
               
          };
       
          console.log("Anonymous Request: " + anonymousRequest);
      

        

           try {
          const resultAction = await dispatch(saveTeacher(anonymousRequest)).unwrap();
         
          setAlertType("success");
          setMessage("Teacher Added Successfully!");
           } catch (error) {
            setAlertType("error");
            setMessage("Error Occured Try Again!")
            
           }

            setOpen(true);
            resetForm();
    };

 
  return (
  
  <ClickAwayListener onClickAway={handleClickAway}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar and Drawer code remains the same... */}
      {/* I'll include just the main content part with the updated Autocomplete fields */}

      {/* Main Content */}
    <Box
           component="main"
           sx={{
             flexGrow: 1,
             marginTop: 6,
             fontSize: 20,
             transition: "margin-left 0.3s ease-in-out",
           }}
         >

  <SignInContainer>

             <Formik
                    initialValues={{
                      firstname: "",
                      surname: "",
                      lastname: "",
                      regNo: "",
                      classes:  [],
                      subjects: [],
                      user: {username: '', password: '',  email: '', role: 'TEACHER', school: ''}
                    }}
                    validationSchema={teacherRegistrationSchema}
                    onSubmit={handleFormSubmit}
                  >
    
                {({
                  errors,
                  handleChange, 
                  handleSubmit, 
                  values,
                  isSubmitting,
                  touched,
                  handleBlur,
                  setFieldValue
                }) => (

                  <Card>
      

      
                  {/*Card Image*/}
            
                 <section class={style.container__brand}>
                         <img src="/images/logo.png" alt="Logo"/>
                </section>
            
                 
             
                  {/*Card Header*/}
                <p className={style['form-header']}>Register Teacher</p>
            
                 
    {/* Text Fields - unchanged */}
<TextField
      label="Firstname"
      placeholder='First Name'
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.firstname}
      name='firstname'
      error={touched.firstname && Boolean(errors.firstname)}
      helperText={touched.firstname && errors.firstname}
      
      slotProps={{
        formHelperText: {
          sx: { fontSize: 15 },
        },
        input: {
          style: { fontSize: 18 },
        },
        inputLabel: {
          style: { fontSize: 16 },
        }
      }}
    />

<TextField
      label="Surname"
      placeholder='Surname'
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.surname}
      name='surname'
      error={touched.surname && Boolean(errors.surname)}
      helperText={touched.surname && errors.surname}
      
      slotProps={{
        formHelperText: {
          sx: { fontSize: 15 },
        },
        input: {
          style: { fontSize: 18 },
        },
        inputLabel: {
          style: { fontSize: 16 },
        }
      }}
    />

<TextField
      label="Lastname"
      variant="outlined"
      fullWidth
      placeholder='Lastname'
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.lastname}
      name='lastname'
      error={touched.lastname && Boolean(errors.lastname)}
      helperText={touched.lastname && errors.lastname}
      
      slotProps={{
        formHelperText: {
          sx: { fontSize: 15 },
        },
        input: {
          style: { fontSize: 18 },
        },
        inputLabel: {
          style: { fontSize: 16 },
        }
      }}
    />


     {/* CLASSES AUTOCOMPLETE WITH SELECT ALL */}
     <Autocomplete
          multiple
          limitTags={1}
          id="classes-autocomplete"
          options={['Select All', ...classNames]}
          getOptionLabel={(option) => option}
          value={values.classes || []}
          onChange={(event, value, reason, details) => {
            if (details?.option === 'Select All') {
              if (value.length - 1 === classNames.length) {
                setFieldValue("classes", []);
              } else {
                setFieldValue("classes", classNames);
              }
            } else {
              const filteredValue = value.filter(item => item !== 'Select All');
              setFieldValue("classes", filteredValue);
            }
          }}
          renderOption={(props, option) => {
            if (option === 'Select All') {
              const allSelected = values.classes?.length === classNames.length;
              return (
                <li {...props} key="select-all">
                  <Checkbox
                    checked={allSelected}
                    style={{ marginRight: 8 }}
                  />
                  ✓ Select All
                </li>
              );
            }
            return <li {...props} key={option}>{option}</li>;
          }}
          renderInput={(params) => (
            <TextField
             {...params} 
             label="Classes" 
             placeholder="Classes"
             variant="filled"
             fullWidth
             margin='normal'
             name='classes'
             error={touched.classes && Boolean(errors.classes)}
             helperText={touched.classes && errors.classes}
             
            slotProps={{
              formHelperText: {
                sx: { fontSize: 15 },
              },
             
              inputLabel: {
                style: { fontSize: 16 },
              }
            }}
    
             
            />
          )}
        
          sx={{
            "& .MuiAutocomplete-tag": {
              fontSize: "14px",
              backgroundColor: "#e0f7fa",
            },
            "& .MuiAutocomplete-option": {
              fontSize: "16px",
            },
            
          }}
    
          slotProps={{
            textField: {
              InputLabelProps: {
                style: { fontSize: "18px", color: "blue" },
              },
              inputProps: {
                style: { fontSize: "16px" },
              },
            },
            popper: {
              sx: {
                "& .MuiAutocomplete-option": {
                  fontSize: "16px",
                },
              },
            },
            tag: {
              style: { fontSize: "14px", backgroundColor: "#e0f7fa" },
            },
          }}
        
        />


           {/* SUBJECTS AUTOCOMPLETE WITH SELECT ALL */}
           <Autocomplete
              multiple
              limitTags={1}
              id="subjects-autocomplete"
              options={[
                { id: 'select-all', name: '✓ Select All' },
                ...subjectWithClassname
              ]}
              getOptionLabel={(option) => option.name}
              value={values.subjects || []}
              onChange={(event, value, reason, details) => {
                if (details?.option?.id === 'select-all') {
                  if (value.length === subjectWithClassname.length) {
                    setFieldValue("subjects", []);
                  } else {
                    setFieldValue("subjects", subjectWithClassname);
                  }
                } else {
                  const filteredValue = value.filter(item => item.id !== 'select-all');
                  setFieldValue("subjects", filteredValue);
                }
              }}
              renderOption={(props, option) => {
                if (option.id === 'select-all') {
                  const allSelected = values.subjects?.length === subjectWithClassname.length;
                  return (
                    <li {...props} key={option.id}>
                      <Checkbox
                        checked={allSelected}
                        style={{ marginRight: 8 }}
                      />
                      {option.name}
                    </li>
                  );
                }
                return <li {...props} key={option.id}>{option.name}</li>;
              }}
              renderInput={(params) => (
                <TextField
                 {...params} 
                 label="Subjects" 
                 placeholder="Subjects"
                 variant="filled"
                 fullWidth
                 margin='normal'
                 name='subjects'
                 error={touched.subjects && Boolean(errors.subjects)}
                 helperText={touched.subjects && errors.subjects}
                 
                slotProps={{
                  formHelperText: {
                    sx: { fontSize: 15 },
                  },
                 
                  inputLabel: {
                    style: { fontSize: 16 },
                  }
                }}
        
                 
                />
              )}
            
              sx={{
                "& .MuiAutocomplete-tag": {
                  fontSize: "14px",
                  backgroundColor: "#e0f7fa",
                },
                "& .MuiAutocomplete-option": {
                  fontSize: "16px",
                },
                
              }}
        
              slotProps={{
                textField: {
                  InputLabelProps: {
                    style: { fontSize: "18px", color: "blue" },
                  },
                  inputProps: {
                    style: { fontSize: "16px" },
                  },
                },
                popper: {
                  sx: {
                    "& .MuiAutocomplete-option": {
                      fontSize: "16px",
                    },
                  },
                },
                tag: {
                  style: { fontSize: "14px", backgroundColor: "#e0f7fa" },
                },
              }}
            
            />
      

             {/* BUTTON */}

             <button  disabled={isSubmitting}  type="submit" onClick={handleSubmit} className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}>{isSubmitting ? 'Submitting...' : 'Save Teacher'}</button>
             
    </Card>

)}
                   
       
       
</Formik>  

    
     <div className={style.footer__brand}>
              <img src="/images/logo.png" alt=""/>
              <p className={style.footer__copyright}> (c) 2025 Miqwii, All Rights Reserved</p>
       </div>


   </SignInContainer>

            
       
      </Box>
      
      {/* Snackbar code remains the same... */}
    </Box>

     
    </ClickAwayListener>  
   
  );
};

export default AddTeacher;