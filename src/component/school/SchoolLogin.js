import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/SchoolLogin.module.css';
import { useState } from 'react';
import React from 'react';
import TextField from '@mui/material/TextField';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Alert, Snackbar } from "@mui/material";
import { Formik } from 'formik';
import { object, string, ref } from 'yup';
import { useNavigate } from 'react-router-dom'
import {IconButton, InputAdornment } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../redux/reducer/loginSlice';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: '550px',
  maxHeight: '85vh', // Fixed height
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
  backgroundColor: '#0A2859',
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



const SchoolLogin = () => {

  const loginSchema = object({
    username: string().max(35, "ID must not exceed 35 characters")
              .required("ID is required"),

    password: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  });
  
  
const [displayText, setDisplayText] = useState("School");
const [role, setRoles] = useState([
    {id: 1, text: "School", isSelected: true, color: "#fff", backgroundColor: "#0a2859"},
    {id: 2, text: "Teacher", isSelected: false, color: "#0a2859", backgroundColor: "#fff"},
    {id: 3, text: "Student", isSelected: false, color: "#0a2859", backgroundColor: "#fff"}
])



const [visibility, setVisibility] = useState(false);
const [inputType, setInputType] = useState('password');
const [open, setOpen] = useState(false); // Controls the Snackbar state
const [alertType, setAlertType] = useState(""); // "success" or "error"
const [message, setMessage] = useState(""); 
const dispatch = useDispatch();
const navigate = useNavigate();
const authenticated = false;

// localStorage.setItem('authenticated', JSON.stringify(authenticated));


const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return; // Prevent closing if the user clicks away
  }
  setOpen(false); // Close the Snackbar
};

const togglePasswordVisibility = () => {
      setVisibility(!visibility);
      if (inputType==='password'){
        setInputType('text')
     } else {
        setInputType('password')
     }
}



const handleRoleClick = (id) => {
    
setRoles((prevRole) =>
  prevRole.map((role) =>
    role.id === id
      ? { ...role,  isSelected: true, color: "#fff", backgroundColor: "#0a2859" }
      : { ...role, isSelected: false, color: "#0a2859", backgroundColor: "#fff"} // Reset other tags
  )
);
setDisplayText(role.find(role => role.id === id).text)
}


     const handleFormSubmit = async (values, { resetForm })  => {

        

       try {
               const body = await dispatch(loginRequest(values)).unwrap();
             
               localStorage.setItem('token', JSON.stringify(body.jwt));
               localStorage.setItem('authenticated', JSON.stringify(!authenticated));

                // setAlertType("success");
                //   setMessage("Login Successfully")
               // if statement here
               if (body.redirectUrl !== 'error'){
                 navigate(body.redirectUrl);
               }

                 } catch (error) {
                  localStorage.setItem('authenticated', JSON.stringify(authenticated));
                  setAlertType("error");
                  setMessage(error.message)
               }
      
                  setOpen(true);
                  resetForm(); // This will reset the forto the initial values
       
                };

  return (
  
   <SignInContainer>

             <Formik
                  initialValues={{
                    username: "",
                    password: "",
                  }}
                  validationSchema={loginSchema}
                  onSubmit={handleFormSubmit}
                  >
    
                {({
                  errors,
                  handleChange, 
                  handleSubmit, 
                  values,
                  isSubmitting,
                  touched,
                  handleBlur
                }) => (

                  <Card>
      

      
                  {/*Card Image*/}
            
                 <section class={style.container__brand}>
                         <img src="/images/logo.png" alt="Logo"/>
                </section>
            
                 
             
                  {/*Card Header*/}
                <p className={style['form-header']}>{displayText} Login</p>
            
                 {/*Login Type Selector*/}
                <div className={style['user-type--container']}>
                       {
                         role.map((r) => (
                           <span onClick={() => handleRoleClick(r.id)} 
                           style={{
                             background: r.backgroundColor,
                             color: r.color,
                             opacity: r.isSelected ? 1 : 0.6
                           }
            
                           }
                           className={style['user-type']}>
                 
                            {r.text}
                           </span>
                         ))
                       }
                      
                      </div>

    {/* Text Fields*/}
<TextField
      label={displayText === "School"  ? `${displayText}   Email` : `${displayText}  Reg. No.`}
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.username}
      name='username'
      error={touched.username && Boolean(errors.username)}
      helperText={touched.username && errors.username}
      
      slotProps={{
        formHelperText: {
          sx: { fontSize: 15 },  // Increase font size of helper text
        },
        input: {
          style: { fontSize: 18 }, // font size for input text
        },
        inputLabel: {
          style: { fontSize: 16 }, // font size for label text
        }
      }}
    />

    
<TextField
      type={inputType}
      label="Password"
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
      name='password'
      error={touched.password && Boolean(errors.password)}
      helperText={touched.password && errors.password}
      slotProps={{
        formHelperText: {
          sx: { fontSize: 15 },  // Increase font size of helper text
        },
        inputLabel: {
          style: { fontSize: 16 }, // font size for label text
        },
        input: {
          style: { fontSize: 18 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {visibility ? <VisibilityIcon sx={{ fontSize: 22, color: "#0e387a" }} />  : <VisibilityOffIcon sx={{ fontSize: 22, color: "#0e387a" }}/>}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
            
             {/* {BUTTON } */}

             <button  disabled={isSubmitting}  type="submit" onClick={handleSubmit} className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}>{isSubmitting ? 'Wait...' : 'Login'}</button>
            

          <div className={style['form-link--container']}>
             <span className={style['form-link']} > Register School here:  <a className={style['link__register']} href="#/school/register">Register</a></span>
             <span className={style['form-link']} > <a className={style['link__register']}  href="#/password/password-request">Forgot Password</a></span>
         </div>

     
            
    </Card>

)}
                   
       
       
</Formik>  

    
     <div className={style.footer__brand}>
              <img src="/images/logo.png" alt=""/>
              <p className={style.footer__copyright}> (c) 2025 Miqwii, All Rights Reserved</p>
       </div>

            <Snackbar
               open={open}
               autoHideDuration={3000} // Automatically hide after 1 second
               onClose={handleClose}
               anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
             >
               <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%", 
                   fontSize: "2rem", 
                   padding: "16px", 
                   textAlign: "center"}} >
                 {message}
               </Alert>
             </Snackbar>

   </SignInContainer>
   

              
        
       
        
        

        
   
  );
};

export default SchoolLogin;



