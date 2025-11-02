import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from "@mui/material";
import Paper from '@mui/material/Paper';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSession } from '../../redux/reducer/sessionSlice';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import style from '../style/form/StudentRegistration.module.css';
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import { Alert, Snackbar } from "@mui/material";
import { setCurrentSession } from '../../redux/reducer/sessionSlice';
import {  
  Dialog
} from '@mui/material';
import ActionMenu from '../utility/ActionMenu';
import Loading from '../Chunks/loading';
import { useLocation, useParams } from 'react-router-dom';
import SchoolDemographicsCharts from '../utility/SchoolChart';
import { getExpiryDate } from '../../redux/reducer/paymentSlice';




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



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0e387a",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



const SchoolDashboard  = () => {

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
        
      


   const subjectRegistrationSchema = object({
         selectedId: string().required("Session required"),
        
    });


  const sessionState = useSelector((state) => state.sessions);
  const { sessions , fetchingStatus} = sessionState;
  const paymentState = useSelector((state) => state.payments);
  const { expiryDate } = paymentState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
 const [anchorEl, setAnchorEl] = React.useState(null);
 const openAnchor = Boolean(anchorEl);
 const [page, setPage] = React.useState(0);
 const [rowsPerPage, setRowsPerPage] = React.useState(5);


 const [open, setOpen] = useState(false); 
 const [alertType, setAlertType] = useState(""); 
 const [message, setMessage] = useState(""); 
 const [initialSelectedId, setInitialSelectedId] = useState(null);
const rows = Array.isArray(sessions) ? sessions : [];
 const params = useParams();
const location = useLocation()



const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}

  useEffect(() => {
    
      fetchData()  
   
  }, [location.pathname]);

  
   const fetchData = () => {
       dispatch(getExpiryDate())
       dispatch(getAllSession()); 
   }


  const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return; // Prevent closing if the user clicks away
  }
  setOpen(false); // Close the Snackbar
};


  
  


      console.log("ARRAY " + rows);

     const handleCheckboxChange = (id) => {
    // formik.setFieldValue("selectedId", id);
  };

    const navigateToAddSession = () => {
      navigate('/session/add-session')
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  const handleFormSubmit = async (values, { resetForm })  => {
  //   console.log(values);
  //    console.log("from inside the useeff" + rows)
  // const selected = rows.forEach(r => r.current === true);
  // console.log("from inside the effect " + selected);
  // setInitialSelectedId(selected?.id ?? null);
         try {
             const resultAction = await dispatch(setCurrentSession(values.selectedId)).unwrap();
             setAlertType("success");
             setMessage(resultAction.message);
             }  catch (error) {
            setAlertType("error");
            setMessage(error)
            
           }
                    
         setOpen(true);
         resetForm(); // This will reset the forto the initial values
      };

   
    return (


        
       <>
         {
          fetchingStatus === 'loading' ? (<Loading/>) : (
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
   <a href="#/school/home" className={[navbar['link--drawer'], navbar['']].join(' ')}>Home</a>
    <a href="#/session/add-session" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Session</a>
    <a href="#/session/setup-session" className={[navbar['link--drawer'], navbar['']].join(' ')}>Setup Session</a>
<a href="#/school/upload-school-logo" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add School Logo</a>
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
    <a href="#/student/add-student" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Student</a>
    <a href="#/student/view-students" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Students</a>
     <a href="#/school/student-activator" className={[navbar['link--drawer'], navbar['']].join(' ')}>Switch Students Account</a>
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
    <a href="#/class/jss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>JSS Classes</a>
    <a href="#/class/sss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>SSS Classes</a>
    <a href="#/class/primary-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>Primary Classes</a>
<a href="#/class/nursery-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}>Nursery Classes</a>
    <a href="#/class/add-jss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add JSS Class</a>
    <a href="#/class/add-sss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add SSS Class</a>
    <a href="#/class/add-pri-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Primary Class</a>
<a href="#/class/add-nur-class" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Nur Class</a>
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
        <a href="#/subject/view-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Subjects</a>
    <a href="#/subject/add-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Subjects</a>
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
         <a href="#/teacher/add-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}>Add Teacher</a>
     <a href="#/teacher/view-teachers" className={[navbar['link--drawer'], navbar['']].join(' ')}>View Teachers</a>
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
     <a href="#/settings/disable-adding-score" className={[navbar['link--drawer'], navbar['']].join(' ')}>Manage Score Input</a>
     
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
    <a href="#/result/show-results" className={[navbar['link--drawer'], navbar['']].join(' ')}>Generate Result</a>
    <a href="#/result/student-result-by-regNo" className={[navbar['link--drawer'], navbar['']].join(' ')}>Search Result</a>
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
     <a href="#/receipt/view-student-reciept" className={[navbar['link--drawer'], navbar['']].join(' ')}>School Fees</a>
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
   <a href="#/payment/pay-subscription" className={[navbar['link--drawer'], navbar['']].join(' ')}>Make Payment</a>
   <a href="#/payment/all-payments" className={[navbar['link--drawer'], navbar['']].join(' ')}>Payments History</a>
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

  <div className={dashboard['secondary--container']}>

       <div class={[dashboard['grid'], dashboard['grid--1x2']].join(' ')}>

         <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            <div class={dashboard['card_button_and_icon']}>
            
            <span class={dashboard['icon-container']}>
            <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#school"></use>
            </svg>
            </span>

            <div>{rows.find((r) => r.school.name)?.school.name ?? 0}</div>
            
          
            </div>
            
            
            
           
            
            </div>
            
            </div>


             <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            <div class={dashboard['card_button_and_icon']}>
            
            <span class={dashboard['icon-container']}>
            <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#subscription"></use>
            </svg>
            </span>

            <div>{"Subs ends on " }
              <p style={{color: "#0e387a", fontSize: "1.9rem", fontWeight: 'bold'}}>
               {expiryDate} 
              </p>
              </div>
            
          
            </div>
            
            
            
           
            
            </div>
            
            </div>

       </div>
        
            {/* <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            <div class={dashboard['card_button_and_icon']}>
            
            <span class={dashboard['icon-container']}>
            <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#school"></use>
            </svg>
            </span>

            <div>{rows.find((r) => r.school.name)?.school.name ?? 0}</div>
            
          
            </div>
            
            
            
           
            
            </div>
            
            </div> */}

            <div class={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>
            
            <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            <div class={dashboard['card_button_and_icon']}>
            
            <span class={dashboard['icon-container']}>
            <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#session"></use>
            </svg>
            </span>
            
            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{rows.find((r) => r.current)?.session ?? 0}</span>
            
            
            </div>
            
            
            
            Current Session
            
            </div>
            
            </div>
            
            
            
            
            <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            <div class={dashboard['card_button_and_icon']}>
            
            <span class={dashboard['icon-container']}>
            <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#session"></use>
            </svg>
            </span>
            
            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{rows.find((r) => r.current)?.term ?? 0}</span>
            
            
            </div>
            
            
            Current Term
            
            </div>
            
            </div>
            
            
            
            
            
            
            <div class={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            
                 <div class={dashboard['card--small-head']}>
                  Add new term and Session
                 </div>
            
                         
                <button onClick={navigateToAddSession}  className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--accent']].join(' ')}> Add new term</button>
            
            
              </div>
            </div>
            
            </div>
           
                   
<div class={[dashboard['grid'], dashboard['grid--1x4']].join(' ')}>
            
          
            
            <SchoolDemographicsCharts/>
            
            
            
  
            
            
         
            
            </div>


               
                
            
            
                    </div>

             
       
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
          )
         }
       </>
    );
}

export default SchoolDashboard;











const ITEM_HEIGHT = 48;
const options = [
    'None',
    'Atria',
    'Callisto'
  ];







  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon sx={{fontSize: 30}} /> : <FirstPageIcon sx={{fontSize: 30}} />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{fontSize: 30}} /> : <KeyboardArrowLeft sx={{fontSize: 30}}/>}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{fontSize: 30}} /> : <KeyboardArrowRight sx={{fontSize: 30}} />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon sx={{fontSize: 30}} /> : <LastPageIcon sx={{fontSize: 30}} />}
        </IconButton>
      </Box>
    );
  }  


  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };