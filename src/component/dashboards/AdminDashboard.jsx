// File: src/component/dashboards/AdminDashboard.jsx
import { IconButton, Snackbar } from "@mui/material";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

import {
  Dialog
} from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import Loading from '../Chunks/loading';
import AdminDemographicsCharts from '../utility/AdminChart';

// Import for dashboard Below

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  getAllSchoolCount,
  getAllStudentCount,
  getAllStudentCountFemale,
  getAllStudentCountMale,
  getAllTeachersCount,
  getClassCountsBySection,
  getTeacherCountsBySection,
} from '../../redux/reducer/schoolSlice';

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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SchoolDashboard = () => {

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

  const schoolState = useSelector((state) => state.schools);
  const {
    allSchoolCount,
    allStudentCount,
    allTeachersCount,
    allStudentCountMale,
    allStudentCountFamale,
    classCountsBySection,
    teacherCountsBySection,
  } = schoolState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnchor = Boolean(anchorEl);

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const location = useLocation();

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(getAllStudentCount()),
        dispatch(getAllSchoolCount()),
        dispatch(getAllTeachersCount()),
        dispatch(getAllStudentCountMale()),
        dispatch(getAllStudentCountFemale()),
        dispatch(getClassCountsBySection()),
        dispatch(getTeacherCountsBySection()),
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
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
                  backgroundColor: "rgba(157, 152, 202, 0.3)",
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
                <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                  <a className={[navbar["logo__link"], navbar["logo"]].join(' ')} href="#">
                    <img src="/images/logo.png" alt="miqwii logo" />
                  </a>
                </Box>

                {!isLargeScreen && (
                  <IconButton onClick={toggleDrawer}>
                    <Cancel sx={{ color: "#0e387a", fontSize: 30 }} />
                  </IconButton>
                )}
              </Box>

              {/* Drawer Content */}
              <List>

                {/* Dashboard Navbar Content */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-0')} className={[navbar['collapsible'], navbar[activeChevron === 'chevron-0' ? 'collapsible--expanded' : null]].join(' ')}>
                  <header className={navbar['collapsible__header']}>
                    <div className={navbar['collapsible__icon']}>
                      <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
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
                    <a href="/admin/home" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Home</a>
                    <a href="/admin/schools" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Schools</a>
                    <a href="/admin/all-session" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>sessions</a>
                  </div>
                </div>

                {/* Profile Navbar Content */}
                <div style={{ cursor: 'pointer' }} onClick={() => toggleChevron('chevron-9')} className={[navbar['collapsible'], navbar[activeChevron === 'chevron-9' ? 'collapsible--expanded' : null]].join(' ')}>
                  <header className={navbar['collapsible__header']}>
                    <div className={navbar['collapsible__icon']}>
                      <svg className={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
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
                    <a href="/admin/profile" className={[navbar['link--drawer'], navbar['']].join(' ')} onClick={(e) => e.stopPropagation()}>Profile</a>
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

                <div className={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>

                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#school"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{allSchoolCount}</span>
                      </div>
                      School
                    </div>
                  </div>

                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#student"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{allStudentCount}</span>
                      </div>
                      Student
                    </div>
                  </div>

                  <div className={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card_button_and_icon']}>
                        <span className={dashboard['icon-container']}>
                          <svg className={[dashboard['icon--big'], dashboard['icon--primary']].join(' ')}>
                            <use href="../images/sprite.svg#teacher"></use>
                          </svg>
                        </span>
                        <span className={[dashboard['badge'], dashboard['']].join(' ')}>{allTeachersCount}</span>
                      </div>
                      Teachers
                    </div>
                  </div>

                </div>

                <div className={[dashboard['grid'], dashboard['grid--1x4']].join(' ')}>

                  <AdminDemographicsCharts />

                </div>

              </div>

            </Box>

            {/* Snackbar */}
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

export default SchoolDashboard;

const ITEM_HEIGHT = 48;
const options = [
  'None',
  'Atria',
  'Callisto'
];