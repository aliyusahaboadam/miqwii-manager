import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import { lazy, useState } from 'react';
import TextField from '@mui/material/TextField';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { Alert, Snackbar } from "@mui/material";
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { saveStudent, resetStatus, getStudentById, updateStudent } from '../../redux/reducer/studentSlice';
import { getClassNames, classExists } from '../../redux/reducer/classSlice';
import { useEffect } from 'react';
import {IconButton, InputAdornment } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Chunks/loading';
import { getTeacherById, updateTeacher } from '../../redux/reducer/teacherSlice';
import Autocomplete from '@mui/material/Autocomplete';
import { getAllSubject, getAllSubjectWithClassname } from '../../redux/reducer/subjectSlice';



// Import for dashboard Below

import React from "react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import { Menu as MenuIcon, Close as CloseIcon, Cancel } from "@mui/icons-material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useLocation } from 'react-router-dom';

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
  maxHeight: '77vh', // Fixed height
  overflowY: 'auto', // Enables vertical scrolling
  '&::-webkit-scrollbar': {
          display: 'none',
        },
        // Hide scrollbar for Firefox
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
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



const UpdateTeacher = () => {

  
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
const { fetchingStatus } = studentState;
const { classNames: classNames,  fetchingStatus: classFetchingStatus, error: classError } = classState;
const subjectState = useSelector((state) => state.subjects);
const { subjectWithClassname } = subjectState;
const dispatch = useDispatch();
const navigate = useNavigate();
const location = useLocation();




const { id, className } = useParams();
const [ loading,  setIsLoading] = useState(true);



const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")

localStorage.setItem('authenticated', JSON.stringify(authenticated));
}


const [state, setState ] = useState({
    id: "",
    firstname: "",
    surname: "",
    lastname: "",
    gender:  "",
    regNo: "",
    classes: [],
    subjects: []
   });

  useEffect(() => {
         fetchData();
         fetchStudent()

  }, [location.pathname]);


   const   fetchStudent = async () => {
        try {
          setIsLoading(true)
          await  dispatch(getTeacherById(id)).unwrap().then((result) => {
            console.log("ganinan" + result.regNo);
           setState({
             id: result.id,
             firstname: result.firstname,
             surname: result.surname,
             lastname: result.lastname,
             entryDate: result.entryDate,
             gender:  result.gender,
             regNo: result.regNo
            })
         });
        
        }  catch (error) {  
         
          setAlertType("error");
          setMessage(error.message);
          console.log(error.message);
         }
         setIsLoading(false) 
         }


         const fetchData = () => {

            dispatch(getClassNames());
       dispatch(getAllSubjectWithClassname());

         }

const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return; // Prevent closing if the user clicks away
  }
  setOpen(false); // Close the Snackbar
};


     const handleFormSubmit = async (values, { resetForm })  => {
        const updatedTeaacher = ({
            id: state.id,
            firstname: values.firstname,
            surname: values.surname,
            lastname: values.lastname,
            entryDate: values.entryDate,
            gender:  values.gender,
          });



            const anonymousRequest = {
              teacher: {
                id: state.id,
                firstname: values.firstname,
                surname: values.surname,
                lastname: values.lastname,
                subjects: values.subjects,
              },
                classNames: values.classes
               
          };
              console.log("Test for subjects data " + JSON.stringify(values.subjects));

           try {
          const result = await dispatch(updateTeacher({id: state.id, teacherData: anonymousRequest})).unwrap();
          setAlertType("success");
          setMessage(result.message);
           navigate(`/teacher/view-teachers`);
           } catch (error) {
            setAlertType("error");
            setMessage(error.message);
            console.log(error.message);
           }

            setOpen(true);
            resetForm(); // This will reset the forto the initial values
    };

    console.log(" chshshhs" + state.firstname)
             
  return (
  
<>

{
  loading === true ? (<Loading/>) : (
    
            <ClickAwayListener onClickAway={handleClickAway}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar */}
      <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
        <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
          {!isLargeScreen && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
            </IconButton>
          )}
          

         
          <div>
 
          {/** Profile Setup */}
          
          <IconButton onClick={profilePopup}    sx={{
          backgroundColor: "#0e387a", // Custom background
          "&:hover": {
            backgroundColor: "#0c3371"
          }
        }}
      
        >

          <PersonOutlineOutlinedIcon
          sx={{ color: "white", fontSize: 25 }} // fontSize in px
          />
          </IconButton>

          <BasePopup sx={{zIndex: 2 }}   id={idProfile} open={openProfile} anchor={anchorProfile}>
          <div className={navbar['profile--selection__container']}>
          <div className={navbar['profile']}>
           <a href="#/school/school-profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
          </div>
          <div className={navbar['logout']}>
           <a onClick={logout} className={[navbar['link--profile'], navbar['']].join(' ')}>Logout</a>
          </div>
          </div>
            
         </BasePopup>
          </div>
        
         
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isLargeScreen ? "persistent" : "temporary"}
        open={isLargeScreen || isDrawerOpen}
        onClose={!isLargeScreen ? toggleDrawer : undefined}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(157, 152, 202, 0.3)", // Transparent backdrop
          }
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #ddd",
            
          }}
        >
          {/* Logo in the center */}
          <Box sx={{ textAlign: "center", flexGrow: 1 }}>
          <a className={[navbar["logo__link"], navbar["logo"]].join(' ')} href="#"><img src="/images/logo.png" alt="miqwii logo"/></a>
          </Box>

          {/* Close Button */}
          {!isLargeScreen && (
            <IconButton  onClick={toggleDrawer}>
              <Cancel sx={{ color: "#0e387a", fontSize: 30 }} />
            </IconButton>
          )}
        </Box>

        {/* Drawer Content */}
        <List>


          
     {/* Dashboard Navbar Content */}
     <div   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-0' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#dashboard"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Dashboard</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-0')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a className={[navbar['link--drawer'], navbar['']].join(' ')}>Logout</a>
    </div>

 </div> 


          
     

     {/* Student Navbar Content */}
     <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-1')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-1' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#student"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Students</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-1')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="#/student/add-student" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Student</a>
    <a href="#/student/view-students" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Students</a>
    </div>

 </div>   

   {/* Class Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-2')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-2' ?  'collapsible--expanded' : null]].join(' ')} >
       <header  className={navbar['collapsible__header']}>
      <div  className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#class"></use>
          </svg>
        <p  className={navbar['collapsible__heading']}>Classes</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-2')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="#/class/jss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>JSS Classes</a>
    <a href="#/class/sss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>SSS Classes</a>
    <a href="#/class/primary-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>Primary Classes</a>
    <a href="#/class/add-jss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add JSS Class</a>
    <a href="#/class/add-sss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add SSS Class</a>
    <a href="#/class/add-pri-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Primary Class</a>
    </div>

 </div> 

      {/* Subject Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-3')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-3' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#subject"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Subjects</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-3')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
        <a href="#/subject/view-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Subjects</a>
    <a href="#/subject/add-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Subjects</a>
    </div>

 </div>   


      {/* Teacher Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-4')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-4' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#teacher"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Teachers</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-4')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
         <a href="#/teacher/add-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Teacher</a>
     <a href="#/teacher/view-teachers" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Teachers</a>
    </div>

 </div>


      {/* Score Navbar Content */}
      <div   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-5' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#score"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Scores</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-5')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
     <a href="#/teacher/add-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Teacher</a>
     <a href="#/teacher/view-teachers" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Teachers</a>
    </div>

 </div>


      {/* Result Navbar Content */}
      <div   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-6' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#result"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Results</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-6')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a className={[navbar['link--drawer'], navbar['']].join(' ')}>Logout</a>
    </div>

 </div>


      {/* School Fee Navbar Content */}
      <div   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-7' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#fee"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>School Fees</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-7')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a className={[navbar['link--drawer'], navbar['']].join(' ')}>Logout</a>
    </div>

 </div>


      {/* Subscription Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-8')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-8' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

         <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#subscription"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Subscription</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-8')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="#/payment/pay-subscription" className={[navbar['link--drawer'], navbar['']].join(' ')}>Pay Subscription</a>
    </div>

 </div>


 {/* Profile Navbar Content */}
 <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-9')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-9' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#profile"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Profile</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-9')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
   <a href="#/school/school-profile" className={[navbar['link--drawer'], navbar['']].join(' ')}>Profile</a>
    <a onClick={logout} className={[navbar['link--drawer'], navbar['']].join(' ')}>Logout</a>
    </div>

 </div> 

  </List>
      </Drawer>

      {/* Main Content */}
    <Box
           component="main"
           sx={{
             flexGrow: 1,
             marginTop: 8,
             fontSize: 23,
             overflowX: 'auto',
             width: '100%',
             color: '#9a99ac',
             transition: "margin-left 0.3s ease-in-out",
           }}
         >
   <SignInContainer>

<Formik
                    initialValues={{
                        firstname: state.firstname || "",
                        surname: state.surname || "",
                        lastname: state.lastname || "",
                        classes: state.classes || [],
                        subjects: state.subjects || []
                      
                        
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
                <p className={style['form-header']}>Update Teacher</p>
            
                 
    {/* Text Fields*/}
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
          sx: { fontSize: 15 },  // Increase font size of helper text
        },
        input: {
          style: { fontSize: 18 }, // font size for input text
        },
        inputLabel: {
          style: { fontSize: 16 }, // font size for label text
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
          sx: { fontSize: 15 },  // Increase font size of helper text
        },
        input: {
          style: { fontSize: 18 }, // font size for input text
        },
        inputLabel: {
          style: { fontSize: 16 }, // font size for label text
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
          sx: { fontSize: 15 },  // Increase font size of helper text
        },
        input: {
          style: { fontSize: 18 }, // font size for input text
        },
        inputLabel: {
          style: { fontSize: 16 }, // font size for label text
        }
      }}
    />


      <Autocomplete
              multiple
              limitTags={1}
              id="multiple-limit-tags"
              options={classNames}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => setFieldValue("classes", value)}
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
                 value={values.classes}
                 
                slotProps={{
                  formHelperText: {
                    sx: { fontSize: 15 },  // Increase font size of helper text
                  },
                 
                  inputLabel: {
                    style: { fontSize: 16 }, // font size for label text
                  }
                }}
        
                 
                />
              )}
            
              sx={{
                "& .MuiAutocomplete-tag": {
                  fontSize: "14px", // Customize the font size of the tags
                  backgroundColor: "#e0f7fa", // Optional: Change tag background color
                },
                "& .MuiAutocomplete-option": {
                  fontSize: "16px", // Customize the font size of dropdown options
                },
                
              }}
        
              slotProps={{
                textField: {
                  InputLabelProps: {
                    style: { fontSize: "18px", color: "blue" }, // Customize label
                  },
                  inputProps: {
                    style: { fontSize: "16px" }, // Customize input font size
                  },
                },
                popper: {
                  sx: {
                    "& .MuiAutocomplete-option": {
                      fontSize: "16px", // Customize dropdown option font size
                    },
                  },
                },
                tag: {
                  style: { fontSize: "14px", backgroundColor: "#e0f7fa" }, // Tag styles
                },
              }}
            
            />
    
    
               <Autocomplete
                  multiple
                  limitTags={1}
                  id="multiple-limit-tags"
                  options={subjectWithClassname}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => setFieldValue("subjects", value)}
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
                     value={values.subjects?.name}
                     
                    slotProps={{
                      formHelperText: {
                        sx: { fontSize: 15 },  // Increase font size of helper text
                      },
                     
                      inputLabel: {
                        style: { fontSize: 16 }, // font size for label text
                      }
                    }}
            
                     
                    />
                  )}
                
                  sx={{
                    "& .MuiAutocomplete-tag": {
                      fontSize: "14px", // Customize the font size of the tags
                      backgroundColor: "#e0f7fa", // Optional: Change tag background color
                    },
                    "& .MuiAutocomplete-option": {
                      fontSize: "16px", // Customize the font size of dropdown options
                    },
                    
                  }}
            
                  slotProps={{
                    textField: {
                      InputLabelProps: {
                        style: { fontSize: "18px", color: "blue" }, // Customize label
                      },
                      inputProps: {
                        style: { fontSize: "16px" }, // Customize input font size
                      },
                    },
                    popper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontSize: "16px", // Customize dropdown option font size
                        },
                      },
                    },
                    tag: {
                      style: { fontSize: "14px", backgroundColor: "#e0f7fa" }, // Tag styles
                    },
                  }}
                
                />


             {/* {BUTTON } */}

             <button  disabled={isSubmitting}  type="submit" onClick={handleSubmit} className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}>{isSubmitting ? 'Submitting...' : 'Update Teacher'}</button>
             
    </Card>

)}
                   
       
       
</Formik>   


<div className={style.footer__brand}>
     <img src="/images/logo.png" alt=""/>
     <p className={style.footer__copyright}> (c) 2025 Miqwii, All Rights Reserved</p>
</div>

{/*This Area is for Snackbar*/}

<Snackbar
      open={open}
      autoHideDuration={3000} // Automatically hide after 1 second
      onClose={handleClose}
      anchorOrigin={{ vertical: "center", horizontal: "center" }} // Position at the top center
    >




<div>
<Dialog
open={open}
onClose={handleClose}
BackdropProps={{
 sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" }, // Darker overlay
}}

sx={{
 "& .MuiDialog-paper": {
   width: '100%',
   borderRadius: "15px", // Optional: Rounded corners
 },
}}

>

{

 alertType === 'success' ? 

 <div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-success']].join(' ')}>
 <div class={dashboard['card_body']}>

              
    <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
         
         <IconButton onClick={handleClose}>
           <Cancel sx={{ fontSize: 30 }} />
         </IconButton>
</span>

 <span class={dashboard['icon-container']}>
         <svg class={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
             <use href="/images/sprite.svg#success-icon"></use>
           </svg>
     </span>

     <p  class={dashboard['alert-message']} >{message}</p>
  
 </div>
 <p class={dashboard['card_footer']}>success</p>
</div>

: 

<div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-error']].join(' ')}>
<div class={dashboard['card_body']}>


  <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
       
            <IconButton onClick={handleClose}>
              <Cancel sx={{ fontSize: 30 }} />
            </IconButton>
   </span>


<span class={dashboard['icon-container']}>
       <svg class={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
           <use href="/images/sprite.svg#error-icon"></use>
         </svg>
   </span>

   <p class={dashboard['alert-message']}>{message}</p>

</div>
<p class={dashboard['card_footer']}>error</p>
</div>


}



   
  
</Dialog>

</div>


    </Snackbar>


</SignInContainer>

             
       
      </Box>
      {/*This Area is for Snackbar*/}
        
                    <Snackbar
                       open={open}
                       autoHideDuration={3000} // Automatically hide after 1 second
                       onClose={handleClose}
                       anchorOrigin={{ vertical: "center", horizontal: "center" }} // Position at the top center
                     >
        
        
        
        
              <div>
              <Dialog
                open={open}
                onClose={handleClose}
                BackdropProps={{
                  sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" }, // Darker overlay
                }}
        
                sx={{
                  "& .MuiDialog-paper": {
                    width: '100%',
                    borderRadius: "15px", // Optional: Rounded corners
                  },
                }}
              
              >
        
                {
        
                  alertType === 'success' ? 
        
                  <div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-success']].join(' ')}>
                  <div class={dashboard['card_body']}>
        
                               
                     <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                          
                          <IconButton onClick={handleClose}>
                            <CloseIcon sx={{ fontSize: 30, color: '#0e387a' }} />
                          </IconButton>
                 </span>
        
                  <span class={dashboard['icon-container']}>
                          <svg class={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                              <use href="/images/sprite.svg#success-icon"></use>
                            </svg>
                      </span>
        
                  <Typography sx={{ fontSize: 21}}>
                    <p class={dashboard['alert-message']}>{message}</p>
                 </Typography>
                   
                  </div>
                   <Typography sx={{ fontSize: 20}}>
                 <p class={dashboard['card_footer']}>success</p>
                </Typography>
                </div>
        
                : 
        
                <div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-error']].join(' ')}>
                <div class={dashboard['card_body']}>
        
        
                   <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                        
                             <IconButton onClick={handleClose}>
                               <CloseIcon sx={{ fontSize: 30 }} />
                             </IconButton>
                    </span>
        
        
                <span class={dashboard['icon-container']}>
                        <svg class={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                            <use href="/images/sprite.svg#error-icon"></use>
                          </svg>
                    </span>
                 <Typography sx={{ fontSize: 21}}>
                    <p class={dashboard['alert-message']}>{message}</p>
                 </Typography>
                </div>
                <Typography sx={{ fontSize: 20}}>
                 <p class={dashboard['card_footer']}>error</p>
                </Typography>
                
              </div>
        
        
                }
              
        
         
                    
                   
              </Dialog>
        
              </div>
        
              
                     </Snackbar>
    </Box>

     
    </ClickAwayListener>  
)
}
</>
        
   
  );
};

export default UpdateTeacher;



