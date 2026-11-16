import { IconButton, Snackbar, Typography } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import PartnerDrawer from '../utility/drawer/PartnerDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { getMyPartnerProfile, resetStatus } from '../../redux/reducer/partnerSlice';
import navbar from '../style/dashboard/SchoolDashboard.module.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  borderRadius: '10px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '520px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  },
}));

const PartnerProfile = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (e) => setAnchorProfile(anchorProfile ? null : e.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const partnerState = useSelector((state) => state.partner);
  const { partner, fetchingStatus } = partnerState;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => {
    dispatch(getMyPartnerProfile());
    return () => dispatch(resetStatus());
  }, [location.pathname]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const isLoading = fetchingStatus === 'loading' && !partner;

  return (
    <>
      {isLoading ? (<Loading />) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
              <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
                {!isLargeScreen && (
                  <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon sx={{ color: "inherit", fontSize: 30 }} />
                  </IconButton>
                )}
                <div>
                  <IconButton onClick={profilePopup} sx={{ backgroundColor: "#0e387a", "&:hover": { backgroundColor: "#0c3371" } }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
                  </IconButton>
                  <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                    <div className={navbar['profile--selection__container']}>
                      <div className={navbar['profile']}>
                        <a href="/partner/profile" className={navbar['link--profile']}>Profile</a>
                      </div>
                      <div className={navbar['logout']}>
                        <a onClick={logout} className={navbar['link--profile']}>Logout</a>
                      </div>
                    </div>
                  </BasePopup>
                </div>
              </Toolbar>
            </AppBar>

            <PartnerDrawer
              isLargeScreen={isLargeScreen}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              logout={logout}
            />

            <Box
              component="main"
              sx={{
                flexGrow: 1, marginTop: 8, fontSize: 23, overflowX: 'auto',
                width: '100%', color: '#9a99ac', transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <SignInContainer>
                <Card>
                  <p className={style['form-header']}>Partner Profile</p>

                  {partner && (
                    <>
                      <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                        <span>Partner Name:</span>
                        {partner.partnerName}
                      </div>

                      <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                        <span>Location:</span>
                        {partner.location || '—'}
                      </div>

                      <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                        <span>Splitter Code:</span>
                        {partner.splitterCode || '—'}
                      </div>

                      <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                        <span>Email:</span>
                        {partner.userEmail || '—'}
                      </div>

                      <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                        <span>Total Schools:</span>
                        {partner.schoolCount ?? 0}
                      </div>

                      {partner.logoUrl && (
                        <div style={{ whiteSpace: 'normal' }} className={dashboard['card--details']}>
                          <span>Logo:</span>
                          <img
                            src={partner.logoUrl}
                            alt="Partner Logo"
                            className="img-round"
                            width="100"
                            height="50"
                          />
                        </div>
                      )}
                    </>
                  )}
                </Card>

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
                      BackdropProps={{ sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" } }}
                      sx={{ "& .MuiDialog-paper": { width: '100%', borderRadius: "15px" } }}
                    >
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
                    </Dialog>
                  </div>
                </Snackbar>
              </SignInContainer>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default PartnerProfile;