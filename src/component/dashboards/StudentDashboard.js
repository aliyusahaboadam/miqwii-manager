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
import ActionMenu from '../utility/ActionMenu';
import Loading from '../Chunks/loading';
import StudentResultById from '../result/StudentResultById';
import { getAuthenticatedStudentById } from '../../redux/reducer/studentSlice';


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



const StudentDashboard  = () => {


  
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
          


  const studentState = useSelector((state) => state.students);
  const { student,  fetchingStatus} = studentState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionState = useSelector((state) => state.sessions);
  const { sessions } = sessionState;

  const scoreState = useSelector((state) => state.scores);
  const { results } = scoreState;
  
 const [anchorEl, setAnchorEl] = React.useState(null);
 const open = Boolean(anchorEl);
 const [page, setPage] = React.useState(0);
 const [rowsPerPage, setRowsPerPage] = React.useState(100);
 const location = useLocation();


const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));

}

const [ loading,  setIsLoading] = useState(true);
const [state, setState ] = useState({
    id: "",
    schoolName: "",
    firstname: "",
    surname: "",
    lastname: "",
    entryDate: "",
    gender:  "",
    regNo: "",

   });

  useEffect(() => {
     
      
        
          fetchStudent()
 
   }, [location.pathname]);
 
 
    const   fetchStudent = async () => {
         try {
           setIsLoading(true)
            dispatch(getAllSession());
            dispatch(getAuthenticatedStudentById())
           await  dispatch(getAuthenticatedStudentById()).unwrap().then((result) => {
             console.log("Student profile test: " + JSON.stringify(result.schoolName));
            setState({
              id: result.id,
              schoolName: result.schoolName,
              firstname: result.firstname,
              surname: result.surname,
              lastname: result.lastname,
              gender:  result.gender,
              entryDate: result.entryDate,
              regNo: result.regNo,
          
             })
          });
         
         }  catch (error) {  
       
           console.log(error.message);
          }
          setIsLoading(false) 
          }
 


  const fetchData = () => {
        
     
  }



  const sessionRows = Array.isArray(sessions) ? sessions : [];


  // const [rows, setRows] = useState(classData);


      console.log("ARRAY " + JSON.stringify(results));


    // Avoid a layout jump when reaching the last page with empty rows.

  
   



   
    return (


        
       <>
         {
          loading === true  ? (<Loading/>) : (
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
           <a href="#/student/student-profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
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
     <a href="#/student/home" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Home</a>
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
      <a href="#/result/student-search-by-regNo" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Search Result</a>
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
      <a href="#/student/student-profile" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Profile</a>
      <a href="#/password/password-reset-student" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Change Password</a>
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
            
            
                        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">

                                  <TableBody>
                                
                                      <StyledTableRow >
                                        <StyledTableCell component="th" scope="row">
                                         <StudentResultById/>
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

export default StudentDashboard;











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