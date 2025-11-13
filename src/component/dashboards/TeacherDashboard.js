import React, { useState } from "react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import { Menu as MenuIcon, Close as CloseIcon, Cancel } from "@mui/icons-material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { getWelcomeMessage } from "../../redux/reducer/teacherSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from '../Chunks/loading';
import { getTeacherOwnedClass } from "../../redux/reducer/classSlice";
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

import { 
  Drawer, 
  IconButton, 
  List, 
  Toolbar, 
  AppBar, 
  Box, 
  Typography, 
  CssBaseline,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import zIndex from "@mui/material/styles/zIndex";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const [activeChevron, setActiveChevron] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const classState = useSelector((state) => state.classes);
  const { classesOwnedByTeacher } = classState;

  const teacherState = useSelector((state) => state.teachers);
  const { welcomeMessage, fetchingStatus } = teacherState;


const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}


   useEffect(() => {
      dispatch(getWelcomeMessage());
      dispatch(getTeacherOwnedClass());
    }, []);


    console.log("form 52 line teacher dashboard" + classesOwnedByTeacher);

  const navigateToViewSubjects = (id, className) => {
          navigate(`/teacher/teacher-subjects/${id}/${className}`)
    }

     const navigateToProfile = () => {
          navigate(`/teacher/teacher-profile`)
    }

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
          <Typography variant="h4" noWrap>
          {welcomeMessage}
          </Typography>

         
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
           <a href="#/teacher/teacher-profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
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
   <a href="#/teacher/home" className={[navbar['link--drawer'], navbar['']].join(' ')}
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
    <a href="#/result/teacher-search-by-regNo" className={[navbar['link--drawer'], navbar['']].join(' ')}
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
            <a href="#/teacher/teacher-profile" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Profile</a>
             <a href="#/password/password-reset-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}
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
          padding: 0.5,
          fontSize: 13,
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Toolbar /> {/* Push content below AppBar */}
        
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
              <div className={dashboard['secondary--container']}>
               <div class={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>
              {
                classesOwnedByTeacher.map((classDetails, index) => (
                  <>
  
  <div class={[dashboard['card--count'], dashboard[index % 2 === 0 ? 'card--primary' : 'card--secondary']].join(' ')}>

             
  <div class={dashboard['card_body']}>
        
        <div class={dashboard['card_button_and_icon']}>
      
        <span class={dashboard['icon-container']}>
              <svg class={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                  <use href="../images/sprite.svg#class"></use>
                </svg>
          </span>
      
          <span class={[dashboard['badge'], dashboard['']].join(' ')}>{classDetails.name}</span>
      
      
        </div>
      
      
      
        
       
      </div>
      <div onClick={() => navigateToViewSubjects(classDetails.id, classDetails.name)} class={dashboard['card_footer']}> CLICK AND VIEW {classDetails.name} SUBJECTS</div>
       
             
              </div>
                  </>
                ))
              }
             </div>
            </div>
      </Box>
    </Box>
    </ClickAwayListener>
        )
      }
    </>
  
  );
};

export default TeacherDashboard;



