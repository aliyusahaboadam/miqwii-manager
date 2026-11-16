// File: src/component/partner/CreatePartnerSchool.jsx
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
import { createPartnerSchool } from '../../redux/reducer/partnerSlice';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/SchoolRegistration.module.css';

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
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#0A2859',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const CreatePartnerSchool = () => {

  const schoolSchema = object({
    name: string()
      .max(42, "School Name must not exceed 42 characters")
      .min(10, "School Name should not be less than 10 characters")
      .required("School Name is required"),

    address: string()
      .max(100, "Address must not exceed 100 characters")
      .required("Address is required"),

    motto: string()
      .max(50, "Motto must not exceed 50 characters")
      .min(10, "Motto should not be less than 10 characters")
      .required("Motto is required"),

    contact: string()
      .max(11, "Phone number should not be more than 11")
      .min(11, "Phone number should not be less than 11")
      .required("Phone Number is required"),

    user: object({
      email: string().email("Invalid email").required("Email required"),
      password: string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: string()
        .min(8, "Password must be at least 8 characters")
        .oneOf([ref('password'), null], 'Passwords must match')
        .required("Password is required"),
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
      const body = await dispatch(createPartnerSchool(values)).unwrap();
      setAlertType("success");
      setMessage(body.message || "School created successfully");
      setOpen(true);
      resetForm();
      setTimeout(() => navigate('/partner/schools'), 1500);
    } catch (error) {
      setAlertType('error');
      setMessage(typeof error === 'string' ? error : (error?.message || "Failed to create school"));
      setOpen(true);
    }
  };

  return (
    <SignInContainer>
      <Formik
        initialValues={{
          name: "",
          address: "",
          motto: "",
          contact: "",
          regNo: "",
          user: { username: '', password: '', confirmPassword: '', email: '', role: 'SCHOOL' },
        }}
        validationSchema={schoolSchema}
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
        }) => (
          <Card>

            {/* Card Image */}
            <section className={style.container__brand}>
              <img src="/images/logo.png" alt="Logo" />
            </section>

            {/* Card Header */}
            <p className={style['form-header']}>Create School</p>

            {/* School Name */}
            <TextField
              label="School Name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              name='name'
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Address */}
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
              name='address'
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Motto */}
            <TextField
              label="Motto"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.motto}
              name='motto'
              error={touched.motto && Boolean(errors.motto)}
              helperText={touched.motto && errors.motto}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Contact */}
            <TextField
              label="Tel"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contact}
              name='contact'
              error={touched.contact && Boolean(errors.contact)}
              helperText={touched.contact && errors.contact}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Email */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.user?.email}
              name='user.email'
              error={touched.user?.email && Boolean(errors.user?.email)}
              helperText={touched.user?.email && errors.user?.email}
              slotProps={{
                formHelperText: { sx: { fontSize: 15 } },
                input: { style: { fontSize: 18 } },
                inputLabel: { style: { fontSize: 16 } },
              }}
            />

            {/* Password */}
            <TextField
              type={inputType}
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.user?.password}
              name='user.password'
              error={touched.user?.password && Boolean(errors.user?.password)}
              helperText={touched.user?.password && errors.user?.password}
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

            {/* Confirm Password */}
            <TextField
              type={inputType}
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.user?.confirmPassword}
              name='user.confirmPassword'
              error={touched.user?.confirmPassword && Boolean(errors.user?.confirmPassword)}
              helperText={touched.user?.confirmPassword && errors.user?.confirmPassword}
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

            {/* Submit */}
            <button
              disabled={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}
            >
              {isSubmitting ? 'Creating School...' : 'Create School'}
            </button>

          </Card>
        )}
      </Formik>

      <div className={style.footer__brand}>
        <img src="/images/logo.png" alt="" />
        <p className={style.footer__copyright}>(c) 2026 Miqwii, All Rights Reserved</p>
      </div>

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
            BackdropProps={{ sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" } }}
            sx={{ "& .MuiDialog-paper": { width: '100%', borderRadius: "15px" } }}
          >
            {alertType === 'success' ? (
              <div style={{ width: '100%', background: '#fff' }} className={[dashboard['card--alert-success']].join(' ')}>
                <div className={dashboard['card_body']}>
                  <span className={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
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
                    <IconButton onClick={handleClose}>
                      <Cancel sx={{ fontSize: 30 }} />
                    </IconButton>
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

export default CreatePartnerSchool;