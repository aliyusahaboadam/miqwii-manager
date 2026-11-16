import { Close as Cancel } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, Snackbar } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';
import { savePartner } from '../../redux/reducer/partnerSlice';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/SchoolRegistration.module.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%',
  minHeight: '550px', maxHeight: '77vh', overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none', msOverflowStyle: 'none',
  borderRadius: '10px', padding: theme.spacing(4), gap: theme.spacing(2), margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative', minHeight: '100vh', width: '100%',
  backgroundColor: '#0A2859',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""', display: 'block', position: 'absolute', zIndex: -1, inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  },
}));

const CreatePartner = () => {
  const partnerSchema = object({
    partnerName: string().min(3, "Name too short").max(100).required("Partner name is required"),
    location: string().max(100, "Location must not exceed 100 characters"),
    splitterCode: string().max(64),
    logoUrl: string().max(512),
    user: object({
      email: string().email("Invalid email").required("Email required"),
      password: string().min(8, "Password must be at least 8 characters").required("Password is required"),
      confirmPassword: string().min(8).oneOf([ref('password'), null], 'Passwords must match').required("Password is required"),
    }),
  });

  const [visibility, setVisibility] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const togglePasswordVisibility = () => {
    setVisibility(!visibility);
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const body = await dispatch(savePartner(values)).unwrap();
      setAlertType("success");
      setMessage(body.message || "Partner created successfully");
      setOpen(true);
      resetForm();
      setTimeout(() => navigate('/admin/partners'), 1500);
    } catch (error) {
      setAlertType('error');
      setMessage(typeof error === 'string' ? error : error?.message || "Failed to create partner");
      setOpen(true);
    }
  };

  return (
    <SignInContainer>
      <Formik
        initialValues={{
          partnerName: "",
          location: "",
          splitterCode: "",
          logoUrl: "",
          user: { email: '', password: '', confirmPassword: '', role: 'PARTNER' },
        }}
        validationSchema={partnerSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, handleChange, handleSubmit, values, isSubmitting, touched, handleBlur }) => (
          <Card>
            <section className={style.container__brand}>
              <img src="/images/logo.png" alt="Logo" />
            </section>

            <p className={style['form-header']}>Create Partner</p>

            <TextField
              label="Partner Name"
              fullWidth margin="normal"
              onChange={handleChange} onBlur={handleBlur}
              value={values.partnerName} name='partnerName'
              error={touched.partnerName && Boolean(errors.partnerName)}
              helperText={touched.partnerName && errors.partnerName}
              variant="outlined"
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            <TextField
              label="Location"
              fullWidth margin="normal"
              onChange={handleChange} onBlur={handleBlur}
              value={values.location} name='location'
              error={touched.location && Boolean(errors.location)}
              helperText={touched.location && errors.location}
              variant="outlined"
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            <TextField
              label="Splitter Code (optional)"
              fullWidth margin="normal"
              onChange={handleChange} onBlur={handleBlur}
              value={values.splitterCode} name='splitterCode'
              error={touched.splitterCode && Boolean(errors.splitterCode)}
              helperText={touched.splitterCode && errors.splitterCode}
              variant="outlined"
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            <TextField
              label="Email"
              fullWidth margin="normal"
              onChange={handleChange} onBlur={handleBlur}
              value={values.user?.email} name='user.email'
              error={touched.user?.email && Boolean(errors.user?.email)}
              helperText={touched.user?.email && errors.user?.email}
              variant="outlined"
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            <TextField
              type={inputType}
              label="Password"
              fullWidth margin="normal"
              onChange={handleChange} onBlur={handleBlur}
              value={values.user?.password} name='user.password'
              error={touched.user?.password && Boolean(errors.user?.password)}
              helperText={touched.user?.password && errors.user?.password}
              variant="outlined"
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                inputLabel: { style: { fontSize: 16 } },
                input: {
                  style: { fontSize: 18 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {visibility
                          ? <VisibilityIcon sx={{ fontSize: 22, color: "#0e387a" }} />
                          : <VisibilityOffIcon sx={{ fontSize: 22, color: "#0e387a" }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              type={inputType}
              label="Confirm Password"
              fullWidth margin="normal"
              onChange={handleChange} onBlur={handleBlur}
              value={values.user?.confirmPassword} name='user.confirmPassword'
              error={touched.user?.confirmPassword && Boolean(errors.user?.confirmPassword)}
              helperText={touched.user?.confirmPassword && errors.user?.confirmPassword}
              variant="outlined"
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                inputLabel: { style: { fontSize: 16 } },
                input: {
                  style: { fontSize: 18 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {visibility
                          ? <VisibilityIcon sx={{ fontSize: 22, color: "#0e387a" }} />
                          : <VisibilityOffIcon sx={{ fontSize: 22, color: "#0e387a" }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <button
              disabled={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
            >
              {isSubmitting ? 'Submitting...' : 'Create Partner'}
            </button>
          </Card>
        )}
      </Formik>

      <div className={style.footer__brand}>
        <img src="/images/logo.png" alt="" />
        <p className={style.footer__copyright}>(c) 2026 Miqwii, All Rights Reserved</p>
      </div>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "center", horizontal: "center" }}>
        <div>
          <Dialog open={open} onClose={handleClose} BackdropProps={{ sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" } }} sx={{ "& .MuiDialog-paper": { width: '100%', borderRadius: "15px" } }}>
            {alertType === 'success' ? (
              <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-success']].join(' ')}>
                <div className={dashboard['card_body']}>
                  <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                    <IconButton onClick={handleClose}><Cancel sx={{ fontSize: 30 }} /></IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg className={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                      <use href="../images/sprite.svg#success-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>success</p>
              </div>
            ) : (
              <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-error']].join(' ')}>
                <div className={dashboard['card_body']}>
                  <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                    <IconButton onClick={handleClose}><Cancel sx={{ fontSize: 30 }} /></IconButton>
                  </span>
                  <span className={dashboard['icon-container']}>
                    <svg className={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                      <use href="../images/sprite.svg#error-icon"></use>
                    </svg>
                  </span>
                  <p className={dashboard['alert-message']}>{message}</p>
                </div>
                <p className={dashboard['card_footer']}>error</p>
              </div>
            )}
          </Dialog>
        </div>
      </Snackbar>
    </SignInContainer>
  );
};

export default CreatePartner;