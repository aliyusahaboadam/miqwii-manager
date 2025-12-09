import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import { maleStudentCount, femaleStudentCount, allStudentCount } from '../../redux/reducer/studentSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClass } from '../../redux/reducer/classSlice';
import Loading from '../Chunks/loading';
import { IconButton } from "@mui/material";
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CirculerProgressLoader from '../utility/CirculerProgressLoader';

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
    const { allStudent,  maleStudent,  femaleStudent, fetchingStatus} = studentsState;

    const classState = useSelector((state) => state.classes);
    const { classes } = classState;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
  

    useEffect(() => {
      fetchCounterData();
       fetchData();
    }, []);




const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}



      const [isInitialLoad, setIsInitialLoad] = React.useState(true);
    
      const fetchData = async () => {
      try {
        setIsInitialLoad(true);
        await Promise.all([
        dispatch(getAllClass())
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };



       const fetchCounterData =  () => {
   
         dispatch(maleStudentCount())
        dispatch(femaleStudentCount())
        dispatch(allStudentCount())
   
    }



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
    <a href="#/session/update-session" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Resumption / Fee</a>
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




  {/* Settings Navbar Content */}
 <div  style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-5')}  className={[navbar['collapsible'], navbar[activeChevron === 'chevron-5' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="../images/sprite.svg#settings"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Settings</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-5')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="../images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
     <a href="#/settings/settings" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Settings</a>
     
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
  
  <span class={[dashboard['badge'], dashboard['']].join(' ')}>{allStudent}</span>
  
  
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
  
  <span class={[dashboard['badge'], dashboard['']].join(' ')}>{maleStudent}</span>
  
  
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
  
  <span class={[dashboard['badge'], dashboard['']].join(' ')}>{femaleStudent}</span>
  
  
  </div>
  
  
  
  Total Females Students
  
  </div>
  
  </div>
              </div>
  
           
           {
             isInitialLoad  ? (<CirculerProgressLoader/>) : (
               
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
             )
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