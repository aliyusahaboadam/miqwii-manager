// File: src/component/student/AddStudent.jsx
import { IconButton, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { classExists, getClassNames } from '../../redux/reducer/classSlice';
import { getCurrentSession } from '../../redux/reducer/sessionSlice';
import { saveStudent } from '../../redux/reducer/studentSlice';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlined';
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';

import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: '550px',
  maxHeight: '77vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  borderRadius: '10px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
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
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
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

const AddStudent = () => {

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorProfile, setAnchorProfile] = React.useState(null);

    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

    const profilePopup = (event) => {
      setAnchorProfile(anchorProfile ? null : event.currentTarget);
    };

    const openProfile = Boolean(anchorProfile);
    const idProfile = openProfile ? 'simple-popper' : undefined;

    const handleClickAway = () => setAnchorProfile(null);

    // -------------------- Validation Schema --------------------
    const studentRegistrationSchema = object({
      firstname: string().max(15, "Firstname must not exceed 15 characters").required("Firstname is required"),
      surname: string().max(15, "Surname must not exceed 15 characters").required("Surname is required"),
      lastname: string().max(15, "Lastname must not exceed 15 characters"),
      entryDate: string().required("Date Required"),
      gender: string().required("Gender Required"),
      class1: object({
        name: string().required("Name required"),
      }),
    });

    // -------------------- Redux + Local State --------------------
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionLoaded, setSessionLoaded] = useState(false);

    const studentState = useSelector((state) => state.students);
    const classState = useSelector((state) => state.classes);
    const sessionState = useSelector((state) => state.sessions);
    const { session: sessionFromStore } = sessionState;
    const { classNames, fetchingStatus: classFetchingStatus } = classState;

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
      localStorage.removeItem('token');
      navigate("/school/login");
      localStorage.setItem('authenticated', JSON.stringify(false));
    };

    // -------------------- Data Fetching --------------------
    useEffect(() => {
      fetchData();
    }, [location.pathname]);

    const fetchData = async () => {
      try {
        // Fetch current session
        const sessionAction = await dispatch(getCurrentSession()).unwrap();
        setCurrentSession(sessionAction || null);
      } catch (error) {
        setCurrentSession(null);
      } finally {
        setSessionLoaded(true);
      }

      // Check if any class exists, then load class names
      try {
        const result = await dispatch(classExists()).unwrap();
        if (result.message === false) {
          setAlertType("error");
          setMessage("No class found. Please create at least one class before adding students.");
          setOpen(true);
        } else if (result.message === true) {
          dispatch(getClassNames());
        }
      } catch (error) {
        // ignore — banner will still show if session is missing
      }
    };

    const handleClose = (event, reason) => {
      if (reason === "clickaway") return;
      setOpen(false);
    };

    const handleFormSubmit = async (values, { resetForm }) => {
      // Block submit if no current session
      if (!currentSession) {
        setAlertType("error");
        setMessage("Cannot add a student without an active session. Please set a current session first.");
        setOpen(true);
        return;
      }

      try {
        const result = await dispatch(saveStudent(values)).unwrap();
        setAlertType("success");
        setMessage(result.message);
      } catch (error) {
        setAlertType("error");
        setMessage(typeof error === 'string' ? error : "Failed to save student");
      }
      setOpen(true);
      resetForm();
    };

    const sessionLabel = currentSession
      ? `${currentSession.session} – ${currentSession.term}`
      : null;

    // -------------------- Render --------------------
    return (
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
                <IconButton onClick={profilePopup} sx={{
                  backgroundColor: "#0e387a",
                  "&:hover": { backgroundColor: "#0c3371" }
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

          <SchoolDrawer
            isLargeScreen={isLargeScreen}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            logout={logout}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              marginTop: 6,
              fontSize: 20,
              transition: "margin-left 0.3s ease-in-out",
            }}
          >
            <SignInContainer>
              <Formik
                initialValues={{
                  firstname: "",
                  surname: "",
                  lastname: "",
                  regNo: "",
                  entryDate: "",
                  gender: "",
                  class1: { name: "" },
                  user: { username: '', password: '', email: '', role: 'STUDENT' }
                }}
                validationSchema={studentRegistrationSchema}
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

                  <Card>

                    <section class={style.container__brand}>
                      <img src="/images/logo.png" alt="Logo" />
                    </section>

                    <p className={style['form-header']}>Register Student</p>

                    {/* ==================================================== */}
                    {/* SESSION BANNER                                       */}
                    {/* ==================================================== */}
                    {sessionLoaded && currentSession && (
                      <div
                        style={{
                          background: '#eef4ff',
                          border: '1px solid #c7d8f5',
                          borderRadius: 10,
                          padding: '10px 14px',
                          fontSize: 15,
                          color: '#0e387a',
                          lineHeight: 1.4,
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          📅 Enrolling into: {sessionLabel} (current)
                        </div>
                        <div style={{ color: '#6b7a99', marginTop: 2, fontSize: 14 }}>
                          The new student will be enrolled in this session.
                        </div>
                        <a
                          href="/session/setup-session"
                          style={{
                            display: 'inline-block',
                            marginTop: 6,
                            color: '#0e387a',
                            textDecoration: 'underline',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          Wrong session? Switch it →
                        </a>
                      </div>
                    )}

                    {sessionLoaded && !currentSession && (
                      <div
                        style={{
                          background: '#fdecec',
                          border: '1px solid #f5c7c7',
                          borderRadius: 10,
                          padding: '12px 14px',
                          fontSize: 15,
                          color: '#8a1c1c',
                          lineHeight: 1.4,
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          ⚠️ No current session is set
                        </div>
                        <div style={{ marginTop: 4, fontSize: 14 }}>
                          You must set a current session before you can add students.
                        </div>
                        <a
                          href="/session/setup-session"
                          style={{
                            display: 'inline-block',
                            marginTop: 6,
                            color: '#8a1c1c',
                            textDecoration: 'underline',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          Set a current session →
                        </a>
                      </div>
                    )}

                    {/* ==================================================== */}
                    {/* STUDENT FORM FIELDS                                  */}
                    {/* ==================================================== */}

                    <TextField
                      label="Firstname"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstname}
                      name='firstname'
                      error={touched.firstname && Boolean(errors.firstname)}
                      helperText={touched.firstname && errors.firstname}
                      slotProps={{
                        formHelperText: { sx: { fontSize: 15 } },
                        input: { style: { fontSize: 18 } },
                        inputLabel: { style: { fontSize: 16 } }
                      }}
                    />

                    <TextField
                      label="Surname"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.surname}
                      name='surname'
                      error={touched.surname && Boolean(errors.surname)}
                      helperText={touched.surname && errors.surname}
                      slotProps={{
                        formHelperText: { sx: { fontSize: 15 } },
                        input: { style: { fontSize: 18 } },
                        inputLabel: { style: { fontSize: 16 } }
                      }}
                    />

                    <TextField
                      label="Lastname"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastname}
                      name='lastname'
                      error={touched.lastname && Boolean(errors.lastname)}
                      helperText={touched.lastname && errors.lastname}
                      slotProps={{
                        formHelperText: { sx: { fontSize: 15 } },
                        input: { style: { fontSize: 18 } },
                        inputLabel: { style: { fontSize: 16 } }
                      }}
                    />

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

                      <FormControl sx={{ m: 1, minWidth: "30%" }}>
                        <InputLabel sx={{ fontSize: 18 }}>Entry Date</InputLabel>
                        <Select
                          label="Entry Date"
                          onChange={(event) => setFieldValue("entryDate", event.target.value)}
                          onBlur={handleBlur}
                          value={values.entryDate}
                          name='entryDate'
                          sx={{ fontSize: 18 }}
                          error={touched.entryDate && Boolean(errors.entryDate)}
                        >
                          <MenuItem sx={{ fontSize: 18 }} value={"2030"}>2030</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2029"}>2029</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2028"}>2028</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2027"}>2027</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2026"}>2026</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2025"}>2025</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2024"}>2024</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2023"}>2023</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2022"}>2022</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2021"}>2021</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2020"}>2020</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2019"}>2019</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"2018"}>2018</MenuItem>
                        </Select>
                        <FormHelperText sx={{ fontSize: 15 }}>{touched.entryDate && errors.entryDate}</FormHelperText>
                      </FormControl>

                      <FormControl sx={{ m: 1, minWidth: "30%" }}>
                        <InputLabel sx={{ fontSize: 18 }}>Class</InputLabel>
                        <Select
                          label="class"
                          name='class1.name'
                          onChange={(event) => setFieldValue("class1.name", event.target.value)}
                          onBlur={handleBlur}
                          value={values.class1?.name}
                          sx={{ fontSize: 18 }}
                          error={touched.class1?.name && Boolean(errors.class1?.name)}
                        >
                          {classNames.map(className => (
                            <MenuItem sx={{ fontSize: 18 }} value={className}>{className}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ fontSize: 15 }}>{touched.class1?.name && errors.class1?.name}</FormHelperText>
                      </FormControl>

                      <FormControl sx={{ m: 1, minWidth: "30%" }}>
                        <InputLabel sx={{ fontSize: 18 }}>Gender</InputLabel>
                        <Select
                          label="Gender"
                          name='gender'
                          onChange={(event) => setFieldValue("gender", event.target.value)}
                          onBlur={handleBlur}
                          value={values.gender}
                          sx={{ fontSize: 18 }}
                          error={touched.gender && Boolean(errors.gender)}
                        >
                          <MenuItem sx={{ fontSize: 18 }} value={"Female"}>Female</MenuItem>
                          <MenuItem sx={{ fontSize: 18 }} value={"Male"}>Male</MenuItem>
                        </Select>
                        <FormHelperText sx={{ fontSize: 15 }}>{touched.gender && errors.gender}</FormHelperText>
                      </FormControl>

                    </div>

                    <button
                      disabled={isSubmitting || !currentSession}
                      type="submit"
                      onClick={handleSubmit}
                      className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                    >
                      {isSubmitting ? 'Submitting...' : (!currentSession ? 'Set a Session First' : 'Save Student')}
                    </button>

                  </Card>
                )}
              </Formik>

              <div className={style.footer__brand}>
                <img src="/images/logo.png" alt="" />
                <p className={style.footer__copyright}> (c) 2026 Miqwii, All Rights Reserved</p>
              </div>
            </SignInContainer>
          </Box>

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
                {alertType === 'success' ? (
                  <div style={{ width: '100%', background: '#fff' }} class={[dashboard['card--alert-success']].join(' ')}>
                    <div class={dashboard['card_body']}>
                      <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                        <IconButton onClick={handleClose}>
                          <CloseIcon sx={{ fontSize: 30, color: '#0e387a' }} />
                        </IconButton>
                      </span>
                      <span class={dashboard['icon-container']}>
                        <svg class={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                          <use href="/images/sprite.svg#success-icon"></use>
                        </svg>
                      </span>
                      <Typography sx={{ fontSize: 21 }}>
                        <p class={dashboard['alert-message']}>{message}</p>
                      </Typography>
                    </div>
                    <Typography sx={{ fontSize: 20 }}>
                      <p class={dashboard['card_footer']}>success</p>
                    </Typography>
                  </div>
                ) : (
                  <div style={{ width: '100%', background: '#fff' }} class={[dashboard['card--alert-error']].join(' ')}>
                    <div class={dashboard['card_body']}>
                      <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                        <IconButton onClick={handleClose}>
                          <CloseIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </span>
                      <span class={dashboard['icon-container']}>
                        <svg class={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                          <use href="/images/sprite.svg#error-icon"></use>
                        </svg>
                      </span>
                      <Typography sx={{ fontSize: 21 }}>
                        <p class={dashboard['alert-message']}>{message}</p>
                      </Typography>
                    </div>
                    <Typography sx={{ fontSize: 20 }}>
                      <p class={dashboard['card_footer']}>error</p>
                    </Typography>
                  </div>
                )}
              </Dialog>
            </div>
          </Snackbar>
        </Box>
      </ClickAwayListener>
    );
};

export default AddStudent;