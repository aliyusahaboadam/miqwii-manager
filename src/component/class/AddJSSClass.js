import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import { lazy, useState } from 'react';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import {IconButton, InputAdornment } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import { Alert, Snackbar } from "@mui/material";
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { saveClass , resetStatus } from '../../redux/reducer/classSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
  width: '100%',
  minHeight: '100vh',
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
        'radial-gradient(at 50% 50%,#002952, hsl(220, 30%, 5%))',
    }),
  },
}));



const AddJSSClass = () => {


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
  

  const classRegistrationSchema = object({
    
   name: string().required("Class is required"),
  
  });


  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000); // Delay before showing content
    return () => clearTimeout(timer);
  }, []);
  


const [open, setOpen] = useState(false); 
const [alertType, setAlertType] = useState(""); 
const [message, setMessage] = useState(""); 
const classState = useSelector((state) => state.classes);
const dispatch = useDispatch();
const navigate = useNavigate();

const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}






const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return; // Prevent closing if the user clicks away
  }
  setOpen(false); // Close the Snackbar
};
        




  const handleFormSubmit = async (values, { resetForm })  => {
      console.log(values);
     
         try {
         const result = await dispatch(saveClass(values)).unwrap();
          console.log(result);
          setAlertType("success");
          setMessage(result.message);
           } catch (error) {
          console.log(error);
          setAlertType("error");
        
           setMessage(error.message); 
        
         }

            setOpen(true);
            resetForm(); // This will reset the forto the initial values
    };

   
               
  return (
  
   
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
           <a href="/school/school-profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
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
        {/* Dashboard Navbar Content */}
    <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-0')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-0' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#dashboard"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Dashboard</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-0')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
   <a href="/school/home" className={[navbar['link--drawer'], navbar['']].join(' ')}>Home</a>
    <a href="/session/add-session" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Session</a>
    <a href="/session/setup-session" className={[navbar['link--drawer'], navbar['']].join(' ')}>Setup Session</a>
<a href="/school/upload-school-logo" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add School Logo</a>
    </div>

 </div> 



          
     

     {/* Student Navbar Content */}
     <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-1')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-1' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#student"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Students</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-1')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="/student/add-student" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Student</a>
    <a href="/student/view-students" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Students</a>
    </div>

 </div>   


    {/* Class Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-2')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-2' ?  'collapsible--expanded' : null]].join(' ')} >
       <header  className={navbar['collapsible__header']}>
      <div  className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#class"></use>
          </svg>
        <p  className={navbar['collapsible__heading']}>Classes</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-2')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="/class/jss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>JSS Classes</a>
    <a href="/class/sss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>SSS Classes</a>
    <a href="/class/primary-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>Primary Classes</a>
    <a href="/class/add-jss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add JSS Class</a>
    <a href="/class/add-sss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add SSS Class</a>
    <a href="/class/add-pri-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Primary Class</a>
    </div>

 </div> 


         {/* Subject Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-3')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-3' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#subject"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Subjects</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-3')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
        <a href="/subject/view-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Subjects</a>
    <a href="/subject/add-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Subjects</a>
    </div>

 </div>  


    {/* Teacher Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-4')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-4' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#teacher"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Teachers</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-4')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
         <a href="/teacher/add-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Teacher</a>
     <a href="/teacher/view-teachers" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Teachers</a>
    </div>

 </div>


         {/* Score Navbar Content */}
      <div  style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-5')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-5' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#score"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Scores</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-5')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
     <a href="/settings/disable-adding-score" className={[navbar['link--drawer'], navbar['']].join(' ')}>Manage Score Input</a>
     
    </div>

 </div>


     {/* Result Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-6')}    className={[navbar['collapsible'], navbar[activeChevron === 'chevron-6' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#result"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Results</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-6')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="/result/show-results" className={[navbar['link--drawer'], navbar['']].join(' ')}>Generate Result</a>
    <a href="/result/student-result-by-regNo" className={[navbar['link--drawer'], navbar['']].join(' ')}>Search Result</a>
    </div>

 </div>


       {/* School Fee Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-7')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-7' ?  'collapsible--expanded' : null]].join(' ')} >
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
     <a href="/receipt/view-student-reciept" className={[navbar['link--drawer'], navbar['']].join(' ')}>School Fees</a>
    </div>

 </div>



     {/* Subscription Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-8')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-8' ?  'collapsible--expanded' : null]].join(' ')} >
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
   <a href="/payment/pay-subscription" className={[navbar['link--drawer'], navbar['']].join(' ')}>Make Payment</a>
   <a href="/payment/all-payments" className={[navbar['link--drawer'], navbar['']].join(' ')}>Payments History</a>
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
   <a href="/school/school-profile" className={[navbar['link--drawer'], navbar['']].join(' ')}>Profile</a>
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
             marginTop: 6,
             fontSize: 20,
             transition: "margin-left 0.3s ease-in-out",
           }}
         >

         <SignInContainer>
        
                     <Formik
                            initialValues={{
                          
                              name: ""
                              
                            }}
                            validationSchema={classRegistrationSchema}
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
                        <p className={style['form-header']}>Add JSS Classes</p>
                    
         
            {/*Input Field*/}
        
        
             <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
             <FormControl sx={{ m: 1, minWidth: "100%"}}>
                <InputLabel  sx={{ fontSize: 18 }} >Select Class</InputLabel>
                  <Select
                  label="class"
                  name='name'
                  variant='filled'
                  onChange={(event) => {setFieldValue("name", event.target.value)}}
                  onBlur={handleBlur}
                  value={values.name}
                  sx={{ fontSize: 18 }}
                  error={touched.gender && Boolean(errors.gender)}
                  
                >
                  
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS1A"}>{"JSS1A"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS1B"}>{"JSS1B"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS1C"}>{"JSS1C"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS1D"}>{"JSS1D"}</MenuItem>
        
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS2A"}>{"JSS2A"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS2B"}>{"JSS2B"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS2C"}>{"JSS2C"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS2D"}>{"JSS2D"}</MenuItem>
                        
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS3A"}>{"JSS3A"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS3B"}>{"JSS3B"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS3C"}>{"JSS3C"}</MenuItem>
                        <MenuItem  sx={{ fontSize: 18 }} value={"JSS3D"}>{"JSS3D"}</MenuItem>
        
          
                </Select>
                <FormHelperText sx={{ fontSize: 15 }}>{touched.name && errors.name}</FormHelperText>
              </FormControl>
        
             </div>
        
             
        
                     {/* {BUTTON } */}
        
                     <button  disabled={isSubmitting}  type="submit" onClick={handleSubmit} className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}>{isSubmitting ? 'Submitting...' : 'Add JSS Class'}</button>
                     <span className={style['form-link']} >Let us know your JSS classes</span>
                     </Card>
        
        )}
                           
               
               
        </Formik>  
        
            
             <div className={style.footer__brand}>
                      <img src="/images/logo.png" alt=""/>
                      <p className={style.footer__copyright}> (c) 2025 Miqwii, All Rights Reserved</p>
               </div>
        
        
             
        
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
                              <use href="../images/sprite.svg#success-icon"></use>
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
                            <use href="../images/sprite.svg#error-icon"></use>
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
   
  );
};

export default AddJSSClass;



