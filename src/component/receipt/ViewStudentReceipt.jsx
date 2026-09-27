import { IconButton } from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllClassnameAndId } from '../../redux/reducer/classSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import CirculerProgressLoader from '../utility/CirculerProgressLoader';

// Import for dashboard Below
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import React from "react";
import { getStudentCountDetails } from '../../redux/reducer/studentSlice';
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';


import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


const ViewStudentReceipt = () => {

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
            



    const studentsState = useSelector((state) => state.students);
    const { studentCountDetails, fetchingStatus} = studentsState;

    const classState = useSelector((state) => state.classes);
    const { classes } = classState;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
  

    useEffect(() => {
     
       fetchData();
    }, []);




const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}




      const fetchData =  () => {
    
        dispatch(getAllClassnameAndId());
        dispatch(getStudentCountDetails());
    
    };






    const navigateToStudents = (name) => {
      navigate(`/receipt/student-reciept/${name}`);
    }

    return (

        <>
          {
            fetchingStatus === "loading" ? (<Loading/>) : (

              
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
      <SchoolDrawer
    isLargeScreen={isLargeScreen}
    isDrawerOpen={isDrawerOpen}
    toggleDrawer={toggleDrawer}
    logout={logout}
/>

      {/* Main Content */}
    <Box
           component="main"
           sx={{
             flexGrow: 1,
             marginTop: 8,
             fontSize: 18,
             overflowX: 'auto',
             width: '100%',
             color: '#9a99ac',
             transition: "margin-left 0.3s ease-in-out",
           }}
         >
  <div className={dashboard['secondary--container']}>
                <div class={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>
                         <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
             <div class={dashboard['card_body']}>
             
             <div class={dashboard['card_button_and_icon']}>
             
             <span class={dashboard['icon-container']}>
             <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
             <use href="../images/sprite.svg#student"></use>
             </svg>
             </span>
             
             <span class={[dashboard['badge'], dashboard['']].join(' ')}>{studentCountDetails?.totalCount}</span>
             
             
             </div>
             
             
             
             Total Students
             
             </div>
             
             </div>
             
             <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
             <div class={dashboard['card_body']}>
             
             <div class={dashboard['card_button_and_icon']}>
             
             <span class={dashboard['icon-container']}>
             <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
             <use href="../images/sprite.svg#student"></use>
             </svg>
             </span>
             
             <span class={[dashboard['badge'], dashboard['']].join(' ')}>{studentCountDetails?.maleCount}</span>
             
             
             </div>
             
             
             
             Total Males Students
             
             </div>
             
             </div>
             
             
             <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
             <div class={dashboard['card_body']}>
             
             <div class={dashboard['card_button_and_icon']}>
             
             <span class={dashboard['icon-container']}>
             <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
             <use href="../images/sprite.svg#student"></use>
             </svg>
             </span>
             
             <span class={[dashboard['badge'], dashboard['']].join(' ')}>{studentCountDetails?.femaleCount}</span>
             
             
             </div>
             
             
             
             Total Females Students
             
             </div>
             
             </div>
                         </div>
           
           {
                
              classes.length === 0 ? <CirculerProgressLoader/> :    
                
                <div class={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>
  
              {
                classes.map((class1, index) => (
                  <>
  
  <div class={[dashboard['card--view'], dashboard[index % 2 === 0 ? 'card--primary' : 'card--secondary']].join(' ')}>
              <div class={dashboard['card_body']}>
  
              <span class={dashboard['icon-container']}>
                      <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                          <use href="../images/sprite.svg#student"></use>
                        </svg>
                  </span>
  
                  <div class={dashboard['card--small-head']}>
       {class1.name}
       </div>
  
       <p> Click below to view {class1.name} fee record .</p>
               
              </div>
              <div onClick={() => navigateToStudents(class1.name)} class={dashboard['card_footer']}>View {class1.name} Students</div>
              </div>
                  </>
                ))
              }
          
            </div>
           }
  
           
               
        
  
           </div>

             
       
      </Box>

    </Box>

     
    </ClickAwayListener> 
            )
          }
        </>
       
    

    );

}

export default ViewStudentReceipt;