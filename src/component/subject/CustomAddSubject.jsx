// File: src/component/subject/CustomAddSubject.jsx
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
import { array, object, string } from 'yup';
import { getClassNames } from '../../redux/reducer/classSlice';
import { saveSubject } from '../../redux/reducer/subjectSlice';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/StudentRegistration.module.css';

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
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

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
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
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
  },
}));

// Same rule as AddSubjects: at least one subject
const subjectRegistrationSchema = object({
  subjects: array()
    .of(
      object({
        name: string()
          .required("Subject name is required")
          .trim()
          .min(2, "At least 2 characters")
          .max(50, "At most 50 characters"),
      })
    )
    .min(1, "Please add at least one subject")
    .required("Subjects are required"),

  class1: object({
    name: string().required("Class is required"),
  }),
});

const CustomAddSubject = () => {

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const [activeChevron, setActiveChevron] = useState(null);

  const toggleChevron = (chevronId) => {
    setActiveChevron((prev) => (prev === chevronId ? null : chevronId));
  };

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  const profilePopup = (event) => {
    setAnchorProfile(anchorProfile ? null : event.currentTarget);
  };

  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;

  const handleClickAway = () => setAnchorProfile(null);

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  const studentState = useSelector((state) => state.students);
  const classState = useSelector((state) => state.classes);
  const { status: subjectStatus } = studentState;
  const { classNames } = classState;

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const fetchData = () => {
    dispatch(getClassNames());
  };

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    // Trim each subject name and drop any accidental blanks
    const cleanedSubjects = (values.subjects || [])
      .map(s => ({ name: (s.name || '').trim() }))
      .filter(s => s.name.length > 0);

    if (cleanedSubjects.length === 0) {
      setAlertType("error");
      setMessage("Please add at least one subject");
      setOpen(true);
      return;
    }

    try {
      const resultAction = await dispatch(
        saveSubject({
          className: values.class1.name,
          subjects: cleanedSubjects,
        })
      ).unwrap();

      setAlertType("success");
      setMessage(resultAction.message || "Subjects added successfully");
    } catch (error) {
      setAlertType("error");
      setMessage(error?.message || "Error Occurred. Try Again!");
    }
    setOpen(true);
    resetForm();
  };

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
              <IconButton onClick={profilePopup} sx={{ backgroundColor: "#0e387a", "&:hover": { backgroundColor: "#0c3371" } }}>
                <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: 25 }} />
              </IconButton>
              <BasePopup sx={{ zIndex: 2 }} id={idProfile} open={openProfile} anchor={anchorProfile}>
                <div className={navbar['profile--selection__container']}>
                  <div className={navbar['profile']}>
                    <a href="/school/school-profile" className={navbar['link--profile']}>Profile</a>
                  </div>
                  <div className={navbar['logout']}>
                    <a onClick={logout} className={navbar['link--profile']}>Logout</a>
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

        <Box component="main" sx={{ flexGrow: 1, marginTop: 6, fontSize: 20, transition: "margin-left 0.3s ease-in-out" }}>
          <SignInContainer>
            <Formik
              initialValues={{
                subjects: [{ name: "" }],
                class1: { name: "" },
              }}
              validationSchema={subjectRegistrationSchema}
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
                setFieldValue,
              }) => {

                const addSubjectField = () => {
                  setFieldValue("subjects", [...values.subjects, { name: "" }]);
                };

                const removeSubjectField = (index) => {
                  const next = values.subjects.filter((_, i) => i !== index);
                  setFieldValue("subjects", next.length ? next : [{ name: "" }]);
                };

                const updateSubjectName = (index, newName) => {
                  const next = [...values.subjects];
                  next[index] = { name: newName };
                  setFieldValue("subjects", next);
                };

                return (
                  <Card>
                    <section className={style.container__brand}>
                      <img src="/images/logo.png" alt="Logo" />
                    </section>

                    <p className={style['form-header']}>Add Custom Subjects</p>

                    {/* Class dropdown — same as AddSubjects */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <FormControl sx={{ m: 1, minWidth: "100%" }}>
                        <InputLabel sx={{ fontSize: 18 }}>Select Class</InputLabel>
                        <Select
                          label="class"
                          name="class1.name"
                          variant="filled"
                          onChange={(event) => setFieldValue("class1.name", event.target.value)}
                          onBlur={handleBlur}
                          value={values.class1?.name}
                          sx={{ fontSize: 18 }}
                          error={touched.class1?.name && Boolean(errors.class1?.name)}
                        >
                          {classNames.map((className) => (
                            <MenuItem key={className} sx={{ fontSize: 18 }} value={className}>
                              {className}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ fontSize: 15 }}>
                          {touched.class1?.name && errors.class1?.name}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    {/* Free-text subject inputs */}
                    <div style={{ width: '100%' }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#0e387a', margin: '12px 0 4px' }}>
                        Subjects
                      </p>
                      <p style={{ fontSize: 13, color: '#6b7a99', margin: '0 0 12px' }}>
                        Type the subject name. Add as many rows as you need.
                      </p>

                      {values.subjects.map((subj, index) => {
                        const fieldError =
                          Array.isArray(errors.subjects) && errors.subjects[index]
                            ? errors.subjects[index].name
                            : undefined;
                        const fieldTouched =
                          Array.isArray(touched.subjects) && touched.subjects[index]
                            ? touched.subjects[index].name
                            : undefined;

                        return (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              gap: 8,
                              alignItems: 'flex-start',
                              marginBottom: 8,
                            }}
                          >
                            <TextField
                              label={`Subject ${index + 1}`}
                              variant="filled"
                              fullWidth
                              value={subj.name}
                              onChange={(e) => updateSubjectName(index, e.target.value)}
                              onBlur={handleBlur}
                              name={`subjects[${index}].name`}
                              error={Boolean(fieldTouched && fieldError)}
                              helperText={fieldTouched && fieldError}
                              slotProps={{
                                input: { sx: { fontSize: 16 } },
                                inputLabel: { sx: { fontSize: 16 } },
                                formHelperText: { sx: { fontSize: 13 } },
                              }}
                            />
                            {values.subjects.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubjectField(index)}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: 8,
                                  border: 'none',
                                  background: '#c43e3e',
                                  color: '#fff',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  height: 56,
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={addSubjectField}
                        style={{
                          marginTop: 6,
                          background: '#0e387a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 16px',
                          cursor: 'pointer',
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        + Add Another Subject
                      </button>
                    </div>

                    {/* Submit */}
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      onClick={handleSubmit}
                      className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
                    >
                      {isSubmitting ? 'Submitting...' : 'Add Custom Subjects'}
                    </button>

                    <span className={style['form-link']}>
                      Add subjects that aren't in the standard list
                    </span>

                    {/* Link back to standard AddSubjects */}
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <a
                        href="/subject/add-subjects"
                        style={{ color: '#0e387a', textDecoration: 'underline', fontSize: 15 }}
                      >
                        Back to standard Add Subject
                      </a>
                    </div>
                  </Card>
                );
              }}
            </Formik>

            <div className={style.footer__brand}>
              <img src="/images/logo.png" alt="" />
              <p className={style.footer__copyright}> (c) 2026 Miqwii, All Rights Reserved</p>
            </div>
          </SignInContainer>
        </Box>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "center", horizontal: "center" }}>
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              BackdropProps={{ sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" } }}
              sx={{ "& .MuiDialog-paper": { width: '100%', borderRadius: "15px" } }}
            >
              {alertType === 'success' ? (
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
              )}
            </Dialog>
          </div>
        </Snackbar>
      </Box>
    </ClickAwayListener>
  );
};

export default CustomAddSubject;