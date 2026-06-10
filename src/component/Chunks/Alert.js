import { Close as Cancel } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { array, object, string } from 'yup';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

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



const SuccessAlert = () => {

  const studentRegistrationSchema = object({
    
    subjects: array().of(object())
    .min(1, "Please select at least one subject")
    .required("Subjects are required"),

   class1: object({
       name: string().required("Name required"),

       }),
   
  });
  


const [open, setOpen] = useState(false); 
const [alertType, setAlertType] = useState(""); 
const [message, setMessage] = useState(""); 
const studentState = useSelector((state) => state.students);
const classState = useSelector((state) => state.classes);
const { status: subjectStatus, error: subjectError } = studentState;
const { classNames: classNames, status: classStatus, error: classError } = classState;
const dispatch = useDispatch();

const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return; // Prevent closing if the user clicks away
  }
  setOpen(false); // Close the Snackbar
};

               
  return (

    <div>
    <div style={{width: '50rem', padding: '4rem'}}>
           <div class={[dashboard['card--alert-error']].join(' ')}>
               <div class={dashboard['card_body']}>


                  <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                       
                            <IconButton >
                              <Cancel sx={{ fontSize: 30 }} />
                            </IconButton>
                   </span>


               <span class={dashboard['icon-container']}>
                       <svg class={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                           <use href="../images/sprite.svg#error-icon"></use>
                         </svg>
                   </span>

                   <p class={dashboard['alert-message']}>No class available add classes</p>
                
               </div>
               <p class={dashboard['card_footer']}>error</p>
             </div>
       
       </div>

       <div style={{width: '50rem', padding: '4rem'}}>
           <div class={[dashboard['card--alert-success']].join(' ')}>
               <div class={dashboard['card_body']}>

                            
                  <span class={[dashboard['icon-container'], dashboard['alert-close']].join(' ')}>
                       
                       <IconButton >
                         <Cancel sx={{ fontSize: 30 }} />
                       </IconButton>
              </span>

               <span class={dashboard['icon-container']}>
                       <svg class={[dashboard['icon--big'], dashboard['icon--success']].join(' ')}>
                           <use href="../images/sprite.svg#success-icon"></use>
                         </svg>
                   </span>

                   <p  class={dashboard['alert-message']} >Added Successfully</p>
                
               </div>
               <p class={dashboard['card_footer']}>success</p>
             </div>
       
       </div>

   </div>
   
  );
};

export default SuccessAlert;
