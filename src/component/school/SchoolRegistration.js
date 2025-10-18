import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import style from '../style/form/SchoolRegistration.module.css';
import { useState } from 'react';
import React from 'react';
import TextField from '@mui/material/TextField';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Alert, Snackbar } from "@mui/material";
import {ErrorMessage, Formik } from 'formik';
import { object, string, ref } from 'yup';
import {IconButton, InputAdornment } from "@mui/material";
import { saveSchool } from '../../redux/reducer/schoolSlice';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import {Close as  Cancel } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  minHeight: '550px',
  maxHeight: '77vh', // Fixed height
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



const SchoolRegistration = () => {

  const schoolRegistrationSchema = object({
    name: string().max(42, "School Name must not exceed 42 characters")
              .required("School Name is required"),

    address: string().max(100, "Address must not exceed 100 characters")
    .required("Address is required"),
    
    motto: string().max(50, "Motto must not exceed 50 characters")
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
    .min(8 , "Password must be at least 8 characters")
    .oneOf([ref('password'), null], 'Passwords must match')
    .required("Password is required")
    }),

   
    

  });
  

const [visibility, setVisibility] = useState(false);
const [inputType, setInputType] = useState('password');
const [open, setOpen] = useState(false); // Controls the Snackbar state
const [alertType, setAlertType] = useState(""); // "success" or "error"
const [message, setMessage] = useState(""); 
const dispatch = useDispatch();
const navigate = useNavigate();


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





     const handleFormSubmit = async (values, { resetForm })  => {
                
                    try {
                      const body = await dispatch(saveSchool(values)).unwrap();
                      console.log(body);
                      setAlertType("success");
                      setMessage(body.message)
                     } catch (error) {
                      console.log(error.message);
                      setAlertType('error');
                      setMessage(error.message);
                     }
                  // Handle form submission logic
                  console.log('Form values:', values);
                  setOpen(true);
                  resetForm(); // This will reset the form to the initial values
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
                      user: {username: '', password: '', confirmPassword: '', email: '', role: 'SCHOOL'}
                    }}
                    validationSchema={schoolRegistrationSchema}
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
                <p className={style['form-header']}>Register School</p>
            
                 
    {/* Text Fields*/}
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
      value={values.user?.password}
      name='user.password'
      error={touched.user?.password && Boolean(errors.user?.password)}
      helperText={touched.user?.password && errors.user?.password}
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

             <button  disabled={isSubmitting}  type="submit" onClick={handleSubmit} className={[style['btn'], style['btn--block'], style['btn--primary']].join(' ')}>{isSubmitting ? 'Submitting...' : 'Register'}</button>
            

          <div className={style['form-link--container']}>
             <span className={style['form-link']} > Already Have an Accoutn:  <a className={style['link__register']} href="#/school/login">Login</a></span>
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
                          anchorOrigin={{ vertical: "center", horizontal: "center" }} // Position at the top center
                        >
           
           
           
           
                 <div>
                 <Dialog
                   open={open}
                   onClose={handleClose}
                   BackdropProps={{
                     sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" }, // Darker overlay
                   }}
           
                   sx={{
                     "& .MuiDialog-paper": {
                       width: '100%',
                       borderRadius: "15px", // Optional: Rounded corners
                     },
                   }}
                 
                 >
           
                   {
           
                     alertType === 'success' ? 
           
                     <div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-success']].join(' ')}>
                     <div class={dashboard['card_body']}>
           
                                  
                        <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                             
                             <IconButton onClick={handleClose}>
                               <Cancel sx={{ fontSize: 30 }} />
                             </IconButton>
                    </span>
           
                     <span class={dashboard['icon-container']}>
                             <svg class={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                                 <use href="../images/sprite.svg#success-icon"></use>
                               </svg>
                         </span>
           
                         <p  class={dashboard['alert-message']} >{message}</p>
                      
                     </div>
                     <p class={dashboard['card_footer']}>success</p>
                   </div>
           
                   : 
           
                   <div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-error']].join(' ')}>
                   <div class={dashboard['card_body']}>
           
           
                      <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                           
                                <IconButton onClick={handleClose}>
                                  <Cancel sx={{ fontSize: 30 }} />
                                </IconButton>
                       </span>
           
           
                   <span class={dashboard['icon-container']}>
                           <svg class={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                               <use href="../images/sprite.svg#error-icon"></use>
                             </svg>
                       </span>
           
                       <p class={dashboard['alert-message']}>{message}</p>
                    
                   </div>
                   <p class={dashboard['card_footer']}>error</p>
                 </div>
           
           
                   }
                 
           
            
                       
                      
                 </Dialog>
           
                 </div>
           
                 
                        </Snackbar>

   </SignInContainer>
   

              
        
       
        
        

        
   
  );
};

export default SchoolRegistration;



