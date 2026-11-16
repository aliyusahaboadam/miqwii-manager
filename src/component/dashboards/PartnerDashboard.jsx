// File: src/component/dashboards/PartnerDashboard.jsx
import { Dialog, IconButton, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

import Loading from '../Chunks/loading';

// Drawer / popup imports
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import PartnerDrawer from "../utility/drawer/PartnerDrawer";

import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from 'react-router-dom';

import {
  getMyPartnerProfile,
  getMyPartnerSchoolCount,
  getMyPartnerStudentCount,
  resetStatus,
} from '../../redux/reducer/partnerSlice';
import PartnerDemographicsCharts from '../utility/PartnerDemographicsCharts';

const PartnerDashboard = () => {

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

  const profilePopup = (event) => {
    setAnchorProfile(anchorProfile ? null : event.currentTarget);
  };

  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;

  const handleClickAway = () => {
    setAnchorProfile(null);
  };

  // ABOVE IS DRAWER LOGIC BELOW IS THE APP LOGIC...

  const partnerState = useSelector((state) => state.partner);
  const {
    partner,
    partnerSchoolCount,
    partnerStudentCount,
    partnerClassCounts,
  } = partnerState;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => {
    fetchData();
    return () => dispatch(resetStatus());
  }, [location.pathname]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(getMyPartnerProfile()),
        dispatch(getMyPartnerSchoolCount()),
        dispatch(getMyPartnerStudentCount()),
      ]);
    } catch (err) {
      console.error("Failed to fetch partner dashboard:", err);
      setAlertType("error");
      setMessage("Failed to load dashboard data");
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Sum the class counts map — populated by PartnerDemographicsCharts
  // { CRECHE: 3, KG: 2, NURSERY: 4, PRIMARY: 8, SECONDARY: 6 } → 23
  const totalClasses = Object.values(partnerClassCounts || {}).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  return (
    <>
      {isLoading === true ? (<Loading />) : (
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
                  <IconButton onClick={profilePopup} sx={{
                    backgroundColor: "#0e387a",
                    "&:hover": {
                      backgroundColor: "#0c3371"
                    }
                  }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
                  </IconButton>

                  <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                    <div className={navbar['profile--selection__container']}>
                      <div className={navbar['profile']}>
                        <a href="/partner/profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
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
                      <PartnerDrawer
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
              <div className={dashboard['secondary--container']}>

                {/* Welcome header */}
                {partner && (
                  <div style={{ marginBottom: '1rem', padding: '0 1rem' }}>
                    <h2 style={{ color: '#0e387a', fontSize: 26, margin: 0 }}>
                      Welcome, {partner.partnerName}
                    </h2>
                    {partner.location && (
                      <p style={{ color: '#9a99ac', fontSize: 15, margin: '0.25rem 0 0 0' }}>
                        {partner.location}
                      </p>
                    )}
                  </div>
                )}

                {/* 3 count cards — same layout as admin */}
                <div className={[dashboard['grid'], dashboard['grid--1x4']].join(' ')}>

                  {/* Schools */}
                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#school"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{partnerSchoolCount}</span>
                      </div>
                      Schools
                    </div>
                  </div>

                  {/* Students */}
                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#student"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{partnerStudentCount}</span>
                      </div>
                      Students
                    </div>
                  </div>

                  {/* Classes — computed from partnerClassCounts map */}
                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#class"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{totalClasses}</span>
                      </div>
                      Classes
                    </div>
                  </div>



                    <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
    <div className={dashboard['card_body']}>
      <div className={dashboard['card--small-head']}>Create School</div>
      <button
        onClick={() => navigate('/partner/create-school')}
        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}
      >
        Add School
      </button>
    </div>
  </div>

                </div>

                {/* Demographics charts — same pattern as admin */}
                <div className={[dashboard['grid'], dashboard['grid--1x4']].join(' ')} style={{ marginTop: '1rem' }}>
                  <PartnerDemographicsCharts />
                </div>

              </div>
            </Box>

            {/* Snackbar / Dialog */}
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "center", horizontal: "center" }}
            >
              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  BackdropProps={{
                    sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" },
                  }}
                  sx={{
                    "& .MuiDialog-paper": {
                      width: '100%',
                      borderRadius: "15px",
                    },
                  }}
                >
                  {
                    alertType === 'success' ? (
                      <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-success']].join(' ')}>
                        <div className={dashboard['card_body']}>
                          <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                            <IconButton onClick={handleClose}>
                              <CloseIcon sx={{ fontSize: 30, color: '#0e387a' }} />
                            </IconButton>
                          </span>

                          <span className={dashboard['icon-container']}>
                            <svg className={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                              <use href="../images/sprite.svg#success-icon"></use>
                            </svg>
                          </span>

                          <Typography sx={{ fontSize: 21 }}>
                            <p className={dashboard['alert-message']}>{message}</p>
                          </Typography>
                        </div>
                        <Typography sx={{ fontSize: 20 }}>
                          <p className={dashboard['card_footer']}>success</p>
                        </Typography>
                      </div>
                    ) : (
                      <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-error']].join(' ')}>
                        <div className={dashboard['card_body']}>
                          <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                            <IconButton onClick={handleClose}>
                              <CloseIcon sx={{ fontSize: 30 }} />
                            </IconButton>
                          </span>

                          <span className={dashboard['icon-container']}>
                            <svg className={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                              <use href="../images/sprite.svg#error-icon"></use>
                            </svg>
                          </span>

                          <Typography sx={{ fontSize: 21 }}>
                            <p className={dashboard['alert-message']}>{message}</p>
                          </Typography>
                        </div>
                        <Typography sx={{ fontSize: 20 }}>
                          <p className={dashboard['card_footer']}>error</p>
                        </Typography>
                      </div>
                    )
                  }
                </Dialog>
              </div>
            </Snackbar>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default PartnerDashboard;