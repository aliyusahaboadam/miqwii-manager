import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { IconButton, Snackbar, TextField } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Formik, getIn } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { array, number, object } from 'yup';
import { saveScore } from '../../redux/reducer/scoreSlice';
import { getStudentsByClassId } from '../../redux/reducer/studentSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

// Import for dashboard Below

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import React, { useMemo } from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';


import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  Toolbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getSettingsState } from '../../redux/reducer/settingsSlice';



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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const TeacherSubject = () => {

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

  const profilePopup  = (event) => {
    setAnchorProfile(anchorProfile ? null : event.currentTarget);
  };

  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;

  const handleClickAway = () => {
      setAnchorProfile(null);
  };

  const scoreRegistrationSchema = object({
   students: array().of(
    object({      
     score: object({
         firstTest: number()
        .typeError('Score must be a number')
        .min(0, 'Minimum is 0')
        .max(20, 'Maximum is 20'),

         secondTest: number()
        .typeError('Score must be a number')
        .min(0, 'Minimum is 0')
        .max(20, 'Maximum is 20'),

         exam: number()
        .typeError('Score must be a number')
        .min(0, 'Minimum is 0')
        .max(60, 'Maximum is 60'),
  
         }),
   
    })
  )
   
     
    });

    const [open, setOpen] = useState(false); 
    const [alertType, setAlertType] = useState(""); 
    const [message, setMessage] = useState(""); 

    const studentsState = useSelector((state) => state.students);
    const { studentsInClassByClassId, fetchingStatus} = studentsState;

    const classState = useSelector((state) => state.classes);
    const { classes } = classState;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation()
    const inputRefs = useRef([]);
 

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const {subjectId, classId, className, subjectName } =  useParams();

    const settingsState = useSelector((state) => state.settings);
    const {disableScoreInputFirstCA,  disableScoreInputSecondCA, disableScoreInputExam} = settingsState;





const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}
  
    useEffect(() => {
     fetchData();
  }, [params, location.pathname]);

  
  const fetchData = () => {
    dispatch(getStudentsByClassId(classId));
    dispatch(getSettingsState());
  }

  const rows = Array.isArray(studentsInClassByClassId) ? studentsInClassByClassId : [];



  const rowIndexMap = useMemo(() => {
  const map = {};
    rows.forEach((row, index) => {
      map[row.id] = index;
    });
    return map;
  }, [rows]);

   
   
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

 
    const handleFormSubmit = async (values, { resetForm })  => {
      try {
        // Filter out students with no scores entered
        const studentsWithScores = values.students.filter(student => {
          const hasScore = student.score.firstTest !== '' || 
                          student.score.secondTest !== '' || 
                          student.score.exam !== '';
          return hasScore;
        });

        if (studentsWithScores.length === 0) {
          setAlertType("error");
          setMessage("Please enter at least one score before saving");
          setOpen(true);
          return;
        }

        const result = await dispatch(saveScore(studentsWithScores)).unwrap();
        setAlertType("success");
        setMessage(result.message);
        
        // Refresh the data after successful save
        await fetchData();
      } catch (error) {
        setAlertType("error");
        setMessage(error.message || "An error occurred while saving scores");
      }
      
      setOpen(true);
    };



// CRITICAL FIX: Convert subjectId from string to number for proper comparison
const subjectIdNumber = Number(subjectId);

const initialValues = {
  students: studentsInClassByClassId.map((student) => {
    // More robust score lookup with proper type conversion
    let score = {};
    
    if (student.scoreReduced && Array.isArray(student.scoreReduced)) {
      score = student.scoreReduced.find(s => {
        const scoreSubjectId = Number(s.subjectId);
        return scoreSubjectId === subjectIdNumber;
      }) || {};
    }
    
    return {
      studentId: student.id,
      classId: Number(classId),
      subjectId: subjectIdNumber,
      scoreId: score.id || null,
      score: {
        id: score.id || null,
        firstTest: score.firstTest !== null && score.firstTest !== undefined ? score.firstTest : '',
        secondTest: score.secondTest !== null && score.secondTest !== undefined ? score.secondTest : '',
        exam: score.exam !== null && score.exam !== undefined ? score.exam : '',
      },
    };
  }),
};

const handleClose = (event, reason) => {
  if (reason === "clickaway") {
    return; // Prevent closing if the user clicks away
  }
  setOpen(false); // Close the Snackbar
};

    return (

        <>
          {
            fetchingStatus === 'loading' ? (<Loading/>) : (
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
          
          <IconButton onClick={profilePopup}    sx={{
          backgroundColor: "#0e387a", // Custom background
          "&:hover": {
            backgroundColor: "#0c3371"
          }
        }}
      
        >

          <PersonOutlineOutlinedIcon
          sx={{ color: "white", fontSize: 25 }} // fontSize in px
          />
          </IconButton>

          <BasePopup sx={{zIndex: 2 }}   id={idProfile} open={openProfile} anchor={anchorProfile}>
          <div className={navbar['profile--selection__container']}>
          <div className={navbar['profile']}>
           <a href="#/teacher/teacher-profile" className={[navbar['link--profile'], navbar['']].join(' ')}>Profile</a>
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
            backgroundColor: "rgba(157, 152, 202, 0.3)", // Transparent backdrop
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
          {/* Logo in the center */}
          <Box sx={{ textAlign: "center", flexGrow: 1 }}>
          <a className={[navbar["logo__link"], navbar["logo"]].join(' ')} href="#"><img src="/images/logo.png" alt="miqwii logo"/></a>
          </Box>

          {/* Close Button */}
          {!isLargeScreen && (
            <IconButton  onClick={toggleDrawer}>
              <Cancel sx={{ color: "#0e387a", fontSize: 30 }} />
            </IconButton>
          )}
        </Box>

        {/* Drawer Content */}
        <List>

          
     {/* Dashboard Navbar Content */}
    
     <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-0')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-0' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#dashboard"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Dashboard</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-0')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
   <a href="#/teacher/home" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Home</a>
    </div>

 </div> 

   {/* Result Navbar Content */}
      <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-6')}    className={[navbar['collapsible'], navbar[activeChevron === 'chevron-6' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
            <use href="/images/sprite.svg#result"></use>
          </svg>
        <p className={navbar['collapsible__heading']}>Results</p>
      </div>
      
        
        <span onClick={() => toggleChevron('chevron-6')} className={navbar['icon-container']}>
            <svg className={[navbar['icon'], navbar['icon--primary'], navbar['icon--white'], navbar['collapsible--chevron']].join(' ')}>
                <use href="/images/sprite.svg#chevron"></use>
              </svg>
        </span>
    </header>
    

    <div className={navbar['collapsible__content--drawer']}>
    <a href="#/result/teacher-search-by-regNo" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Search Result</a>
    </div>

 </div>


 {/* Profile Navbar Content */}
         <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-9')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-9' ?  'collapsible--expanded' : null]].join(' ')} >
               <header className={navbar['collapsible__header']}>
              <div className={navbar['collapsible__icon']}>
        
              <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
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
            <a href="#/teacher/teacher-profile" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Profile</a>
             <a href="#/password/password-reset-teacher" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Change Password</a>
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
         
    <div class={[dashboard['card--count'], dashboard['card--primary']].join(' ')}>
               <div class={dashboard['card_body']}>
               
               <div class={dashboard['card_button_and_icon']}>
             
               <span class={[dashboard['badge'], dashboard['']].join(' ')}>{subjectName}</span>
               
               
               </div>
               
               
                  {className}
               
               </div>
               
               </div>

  
       
          <Formik
  initialValues={initialValues}
  validationSchema={scoreRegistrationSchema}
  onSubmit={handleFormSubmit}
   enableReinitialize
  validateOnChange={false}
  validateOnBlur={true}
  
>
  {(formik) => {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
    } = formik;

    // --- REFS FOR AUTO FOCUS ---
    if (!inputRefs.current) inputRefs.current = [];

    // --- AUTO MOVE HANDLER ---
    const handleScoreChange = (e, nextIndex) => {
      const value = e.target.value;

      // prevent more than 2 digits
      if (value.length > 2) return;

      // update formik
      handleChange(e);

      // auto move
      if (value.length === 2 && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    };

    return (
      <>
        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">S/N</StyledTableCell>
                <StyledTableCell align="left">Reg. No</StyledTableCell>
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="left">1st CA</StyledTableCell>
                <StyledTableCell align="right">2nd</StyledTableCell>
                <StyledTableCell align="left">Exam</StyledTableCell>
              </TableRow>
            </TableHead>

<TableBody>
  {(rowsPerPage > 0
    ? rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : rows
  ).map((row, displayIndex) => {
   const actualIndex = rowIndexMap[row.id];

    return (
      <StyledTableRow key={row.id}>
        <StyledTableCell>{page * rowsPerPage + displayIndex + 1}</StyledTableCell>

        <StyledTableCell>{row.regNo}</StyledTableCell>

        <StyledTableCell>
          {row.firstname + " " + row.surname + " " + row.lastname}
        </StyledTableCell>

       {/* --- FIRST CA --- */}
<StyledTableCell>
  <TextField
    inputRef={(el) =>
      (inputRefs.current[actualIndex * 3] = el)
    }
    disabled={!disableScoreInputFirstCA}
    label="First CA"
    variant="outlined"
    fullWidth
    margin="dense"
    value={
      values.students[actualIndex]?.score?.firstTest || ""
    }
    type="tel"  // I Use Tell To Allow Leading Zeros
    inputMode="numeric"  
    name={`students[${actualIndex}].score.firstTest`}
    onChange={(e) =>
      handleScoreChange(e, actualIndex * 3 + 1)
    }
    onBlur={handleBlur}
    error={Boolean(
      getIn(errors, `students[${actualIndex}].score.firstTest`) &&
      getIn(touched, `students[${actualIndex}].score.firstTest`)
    )}
    helperText={
      getIn(touched, `students[${actualIndex}].score.firstTest`) &&
      getIn(errors, `students[${actualIndex}].score.firstTest`)
    }
    slotProps={{
      input: { 
        sx: { 
          fontSize: 16, 
          padding: 0,
          '& input': {
            padding: '15px 6px'
          }
        } 
      },
      inputLabel: { sx: { fontSize: 13 } },
      formHelperText: { sx: { fontSize: 12 } },
    }}
  />
</StyledTableCell>

{/* --- SECOND CA --- */}
<StyledTableCell>
  <TextField
    inputRef={(el) =>
      (inputRefs.current[actualIndex * 3 + 1] = el)
    }
    disabled={!disableScoreInputSecondCA}
    label="Second CA"
    variant="outlined"
    fullWidth
    margin="dense"
    type="tel"
    inputMode="numeric"
    value={
      values.students[actualIndex]?.score?.secondTest || ""
    }
    name={`students[${actualIndex}].score.secondTest`}
    onChange={(e) =>
      handleScoreChange(e, actualIndex * 3 + 2)
    }
    onBlur={handleBlur}
    error={Boolean(
      getIn(errors, `students[${actualIndex}].score.secondTest`) &&
      getIn(touched, `students[${actualIndex}].score.secondTest`)
    )}
    helperText={
      getIn(touched, `students[${actualIndex}].score.secondTest`) &&
      getIn(errors, `students[${actualIndex}].score.secondTest`)
    }
    slotProps={{
      input: { 
        sx: { 
          fontSize: 16, 
          padding: 0,
          '& input': {
              padding: '15px 6px'
          }
        } 
      },
      inputLabel: { sx: { fontSize: 13 } },
      formHelperText: { sx: { fontSize: 12 } },
    }}
  />
</StyledTableCell>

{/* --- EXAM --- */}
<StyledTableCell>
  <TextField
    inputRef={(el) =>
      (inputRefs.current[actualIndex * 3 + 2] = el)
    }
    disabled={!disableScoreInputExam}
    label="Exam"
    variant="outlined"
    fullWidth
    margin="dense"
    value={
      values.students[actualIndex]?.score?.exam || ""
    }
    type="tel"
    inputMode="numeric"
    name={`students[${actualIndex}].score.exam`}
    onChange={(e) =>
      handleScoreChange(e, actualIndex * 3 + 3)
    }
    onBlur={handleBlur}
    error={Boolean(
      getIn(errors, `students[${actualIndex}].score.exam`) &&
      getIn(touched, `students[${actualIndex}].score.exam`)
    )}
    helperText={
      getIn(touched, `students[${actualIndex}].score.exam`) &&
      getIn(errors, `students[${actualIndex}].score.exam`)
    }
    slotProps={{
      input: { 
        sx: { 
          fontSize: 16, 
          padding: 0,
          '& input': {
            padding: '15px 6px'
          }
        } 
      },
      inputLabel: { sx: { fontSize: 13 } },
      formHelperText: { sx: { fontSize: 12 } },
    }}
  />
</StyledTableCell>
      </StyledTableRow>
    );
  })}
</TableBody>
            {/* --- PAGINATION --- */}
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[100, 200, 300, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={{
                    "& .MuiTablePagination-toolbar": { fontSize: 18 },
                    "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                    "& .MuiTablePagination-input": { fontSize: 18 },
                    "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* --- SUBMIT BUTTON --- */}
        <div class={[dashboard["card--add"], dashboard["card--primary"]].join(" ")}>
          <div class={dashboard["card_body"]}>
            <button
              disabled={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={[
                dashboard["btn"],
                dashboard["btn--block"],
                dashboard["btn--green"],
              ].join(" ")}
            >
              {isSubmitting ? "Submitting..." : "Save Scores"}
            </button>
          </div>
        </div>
      </>
    );
  }}
</Formik>


 


          {/*This Area is for Snackbar*/}

        <Snackbar
               open={open}
               autoHideDuration={3000} // Automatically hide after 3 seconds
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
                      <use href="/images/sprite.svg#success-icon"></use>
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
                    <use href="/images/sprite.svg#error-icon"></use>
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

  

           </div>

             
       
      </Box>
    </Box>

     
    </ClickAwayListener>  
            )
          }
        </>
       
    

    );

}

export default TeacherSubject;




 function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon sx={{fontSize: 30}} /> : <FirstPageIcon sx={{fontSize: 30}} />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{fontSize: 30}} /> : <KeyboardArrowLeft sx={{fontSize: 30}}/>}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{fontSize: 30}} /> : <KeyboardArrowRight sx={{fontSize: 30}} />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon sx={{fontSize: 30}} /> : <LastPageIcon sx={{fontSize: 30}} />}
        </IconButton>
      </Box>
    );
  }  


  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };