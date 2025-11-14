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
import { getClassNamesStartingWith, getClassCount, getClassCountSpecific } from '../../redux/reducer/classSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveClass , resetStatus, deleteClass, getAllClass } from '../../redux/reducer/classSlice';
import { getAllSession } from '../../redux/reducer/sessionSlice';
import { getResultByClassId } from '../../redux/reducer/scoreSlice';
import StudentResults from './StudentResults';
import ActionMenu from '../utility/ActionMenu';
import Loading from '../Chunks/loading';
import { getStudentRegNo }  from '../../redux/reducer/studentSlice';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import style from '../style/form/StudentRegistration.module.css';
import { Formik } from 'formik';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
import { useLocation } from 'react-router-dom';
import StudentResultByRegNo from './StudentResultByRegNo';

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
  },
}));

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



const ShowResults  = () => {


  
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
          

            const [state, setState] = useState({
                regNo: "",
                firstname: "",
                surname: "",
                lastname: "",
                session: "",
                term: ""
            })
  
 const [alertType, setAlertType] = useState(""); 
 const [message, setMessage] = useState(""); 

  const classState = useSelector((state) => state.classes);
  const { classes,  fetchingStatus} = classState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionState = useSelector((state) => state.sessions);
  const { sessions } = sessionState;


const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}


  
 const [anchorEl, setAnchorEl] = React.useState(null);
 const open = Boolean(anchorEl);
 const [page, setPage] = React.useState(0);
 const [rowsPerPage, setRowsPerPage] = React.useState(100);
 const location = useLocation();

  useEffect(() => {
    fetchData();
  
  }, []);


  const fetchData = () => {
        //  dispatch(getAllClass());
      dispatch(getAllSession());
  }



  const sessionRows = Array.isArray(sessions) ? sessions : [];
  const rows = Array.isArray(classes) ? classes : [];

  // const [rows, setRows] = useState(classData);


      


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
        
           console.log("Testing form" + values.regNo);
           console.log("Testing form" + values.term);
           console.log("Testing form" + values.session);
           const anonymousRequest = {
            regNo: values.regNo,
            term: values.term,
            session: values.session,
           }
           try {
          const result = await dispatch(getStudentRegNo(anonymousRequest)).unwrap();
            console.log("Testing form" + result.firstname)
            setState({
                regNo: result.regNo,
                firstname: result.firstname,
                surname: result.surname,
                lastname: result.lastname,
                session: values.session,
                term: values.term
            })
           } catch (error) {
          
           }

       
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
   <a href="#/school/home" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Home</a>
    <a href="#/session/add-session" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Session</a>
    <a href="#/session/setup-session" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Setup Session</a>
<a href="#/school/upload-school-logo" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add School Logo</a>
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
    <a href="#/student/add-student" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Student</a>
    <a href="#/student/view-students" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>View Students</a>
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
    <a href="#/class/jss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>JSS Classes</a>
    <a href="#/class/sss-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>SSS Classes</a>
    <a href="#/class/primary-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Primary Classes</a>
<a href="#/class/nursery-classes" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Nursery Classes</a>
    <a href="#/class/add-jss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add JSS Class</a>
    <a href="#/class/add-sss-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add SSS Class</a>
    <a href="#/class/add-pri-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Primary Class</a>
<a href="#/class/add-nur-class" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Nur Class</a>
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
        <a href="#/subject/view-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>View Subjects</a>
    <a href="#/subject/add-subjects" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Subjects</a>
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
         <a href="#/teacher/add-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Add Teacher</a>
     <a href="#/teacher/view-teachers" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>View Teachers</a>
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
     <a href="#/settings/disable-adding-score" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Manage Score Input</a>
     
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
       <a href="#/result/show-results" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Generate Result</a>
       <a href="#/result/student-result-by-regNo" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Search Result</a>
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
     <a href="#/receipt/view-student-reciept" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>School Fees</a>
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
   <a href="#/payment/pay-subscription" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Make Payment</a>
   <a href="#/payment/all-payments" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Payments History</a>
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
   <a href="#/school/school-profile" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Profile</a>
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
            <use href="../images/sprite.svg#result"></use>
            </svg>
            </span>
            
            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{sessionRows.find((r) => r.current)?.session ?? 0}</span>
            
            
            </div>
            
            
            
            Current Session
            
            </div>
            
            </div>
            
            
            
            
            <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
            
            <div class={dashboard['card_button_and_icon']}>
            
            <span class={dashboard['icon-container']}>
            <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#result"></use>
            </svg>
            </span>
            
            <span class={[dashboard['badge'], dashboard['']].join(' ')}>{sessionRows.find((r) => r.current)?.term ?? 0}</span>
            
            
            </div>
            
            
            Current Term
            
            </div>
            
            </div>
            </div>
            {/* <div>{classNamesSpecific}</div> */}


     

             <Formik
                    initialValues={{
                      
                      regNo:  "",
                      session: "",
                      term: ""
                     
                      
                    }}
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
 <>

<TextField
      label="Search Student Result By Reg No."
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.regNo}
      name="regNo"
   
      
      slotProps={{
     
        input: {
          style: { fontSize: 18 }, // font size for input text
        },
        inputLabel: {
          style: { fontSize: 16 }, // font size for label text
        }
      }}
    />


     <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
    
          <FormControl sx={{ m: 1, minWidth: "100%"}}>
            <InputLabel  sx={{ fontSize: 18 }} >Select Year</InputLabel>
              <Select
              label="Session"
              name='session'
              variant='filled'
              onChange={(event) => setFieldValue("session", event.target.value)}
              onBlur={handleBlur}
              value={values.session}
              sx={{ fontSize: 18 }}
           
    
            >
              {
    
                 sessionsList.map(session => (
    
                    <MenuItem  sx={{ fontSize: 18 }} value={session}>{session}</MenuItem>
    
                  ))
    
              }
             
             
              
    
      
            </Select>
            
          </FormControl>
    
         </div>
    
           <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
    
          <FormControl sx={{ m: 1, minWidth: "100%"}}>
            <InputLabel  sx={{ fontSize: 18 }} >Select Term</InputLabel>
              <Select
              label="Term"
              name='term'
              variant='filled'
              onChange={(event) => setFieldValue("term", event.target.value)}
              onBlur={handleBlur}
              value={values.term}
              sx={{ fontSize: 18 }}
              
    
            >
              {
    
                  terms.map(term => (
    
                    <MenuItem  sx={{ fontSize: 18 }} value={term}>{term}</MenuItem>
    
                  ))
    
              }
             
             
              
    
      
            </Select>
           
          </FormControl>
    
         </div>





          
            <button    type="submit" onClick={handleSubmit} className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}>{isSubmitting ? 'Searching...' : 'Search Result'}</button>
        
           </>

            
   

)}
                   
       
       
</Formik>  

    






            
            
                        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">

                                  <TableBody>
                                
                                      <StyledTableRow >
                                        <StyledTableCell component="th" scope="row">
                                          {
                                            state.regNo === "" ?  "" : <StudentResultByRegNo requestData={{regNo: state.regNo, session: state.session, term: state.term}}  />
                                          }
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                          {
                                           state.firstname + " " + state.surname + " " + state.lastname
                                          }
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {state.regNo}
                                        </StyledTableCell>
                                                       
                                      </StyledTableRow>
                                  
                                  </TableBody>
                                  <TableFooter>
                                  <TableRow>
                                   
                                  </TableRow>
                                </TableFooter>
                                </Table>
                              </TableContainer>
                    </div>

             
       
      </Box>
  
    </Box>

     
    </ClickAwayListener>  
          )
         }
       </>
    );
}

export default ShowResults;


  const sessionsList = [
  "2025/2026",
  "2026/2027",
   "2027/2028",
  "2028/2029",
 "2029/2030",

  
];


const terms = [

  "1st",
  "2nd",
  "3rd",

];








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


  

