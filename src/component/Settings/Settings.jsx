import { IconButton } from '@mui/material';
import MuiCard from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeInputStateExam, changeInputStateFirstCA, changeInputStateSecondCA, changePositioningState, getSettingsState } from '../../redux/reducer/settingsSlice';
import style from '../style/form/StudentRegistration.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';



// Import for dashboard Below

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';


import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from 'react-router-dom';


const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));



const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: 'auto',
  maxHeight: 'auto', // Fixed height
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



const Settings = () => {


  
    const theme = useTheme();
            const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
            const [isDrawerOpen, setDrawerOpen] = useState(false);
            const [anchorProfile, setAnchorProfile] = React.useState(null);
            const [activeChevron, setActiveChevron] = useState(null);
            const location = useLocation();
          
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
          

 


const enabledFirstCA = useSelector((state) => state.settings.disableScoreInputFirstCA);
const enabledSecondCA = useSelector((state) => state.settings.disableScoreInputSecondCA);
const enabledExam = useSelector((state) => state.settings.disableScoreInputExam);
const enabledPositioning = useSelector((state) => state.settings.disablePositioning);
const fetchingStatus = useSelector((state) => state.settings.fetchingStatus);
// const { classNames: classNames,  fetchingStatus: classFetchingStatus, error: classError } = classState;
const dispatch = useDispatch();
const navigate = useNavigate();


const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}


    
useEffect(() => {
     fetchData();
  }, [location.pathname]);

  
  const fetchData = () => {
    dispatch(getSettingsState());
  }


  const handleTogglePositioning = (event) => {
    dispatch(changePositioningState(event.target.checked));
  };

 const handleToggleFirstCA = (event) => {
    console.log("From inside C.A Test First " +  event.target.checked)
    dispatch(changeInputStateFirstCA(event.target.checked));
  };

  const handleToggleSecondCA= (event) => {
    dispatch(changeInputStateSecondCA(event.target.checked));
  };

  const handleToggleExam = (event) => {
    dispatch(changeInputStateExam(event.target.checked));

  };

  
 
  

  console.log("Redux value (enabled):", enabledFirstCA);
            
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
             fontSize: 23,
             overflowX: 'auto',
             width: '100%',
             color: '#9a99ac',
             transition: "margin-left 0.3s ease-in-out",
           }}
         >
<SignInContainer>

             
                  <Card>

                     {/*Card Image*/}
                                
                                     <section class={style.container__brand}>
                                             <img src="/images/logo.png" alt="Logo"/>
                                    </section>
                                
                                     
                                 
                                      {/*Card Header*/}
                                      <p className={style['form-header']}>{fetchingStatus === "loading" ? "Loading..." : ""}</p>
                                    

                    <FormGroup>



                      
         <FormControlLabel
        control={
        <Android12Switch 
        checked={enabledPositioning}
        onChange={handleTogglePositioning}
         sx={{
        transform: 'scale(1.2)', // Scale the whole switch
        marginRight: 1, // Optional: spacing between switch and label
      }}
        
        />}
        label={`${enabledPositioning ? "Enabled" : "Disabled"} Positioning`}
             sx={{
    '.MuiFormControlLabel-label': {
      fontSize: '1.8rem', // Increase label font size
    }}}
      />

        
    <FormControlLabel
        control={
        <Android12Switch 
        checked={enabledFirstCA}
        onChange={handleToggleFirstCA}
         sx={{
        transform: 'scale(1.2)', // Scale the whole switch
        marginRight: 1, // Optional: spacing between switch and label
      }}
        
        />}
        label={`${enabledFirstCA ? "Enabled" : "Disabled"} First CA Score Input`}
             sx={{
    '.MuiFormControlLabel-label': {
      fontSize: '1.8rem', // Increase label font size
    }}}
      />







         <FormControlLabel
        control={
        <Android12Switch 
        // defaultChecked 
        checked={enabledSecondCA}
        onChange={handleToggleSecondCA}
           sx={{
        transform: 'scale(1.2)', // Scale the whole switch
        marginRight: 1, // Optional: spacing between switch and label
      }}
        />
    }
        label={`${enabledSecondCA ? "Enabled" : "Disabled"} Second CA Score Input`}
             sx={{
    '.MuiFormControlLabel-label': {
      fontSize: '1.8rem', // Increase label font size
    }}}
      />



        <FormControlLabel
        control={
        <Android12Switch 
        // defaultChecked
         checked={enabledExam}
        onChange={handleToggleExam}
               sx={{
        transform: 'scale(1.2)', // Scale the whole switch
        marginRight: 1, // Optional: spacing between switch and label
      }} />}
        label={`${enabledExam ? "Enabled" : "Disabled"} Exam Score Input`}
          sx={{
    '.MuiFormControlLabel-label': {
      fontSize: '1.8rem', // Increase label font size
    }}}
      />




   
                    </FormGroup>
      

      
                  </Card>

 

    
     <div className={style.footer__brand}>
              <img src="/images/logo.png" alt=""/>
              <p className={style.footer__copyright}> (c) 2026 Miqwii, All Rights Reserved</p>
       </div>



   </SignInContainer>

             
       
      </Box>
   
    </Box>

     
    </ClickAwayListener>   
  );
};

export default Settings;



