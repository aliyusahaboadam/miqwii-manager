import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { IconButton } from "@mui/material";
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
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

// Import for dashboard Below

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Cancel, Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import React from "react";
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
import { deleteSession, getAllSession } from '../../redux/reducer/sessionSlice';
import SessionActionMenu from '../utility/SessionActionMenu';



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



const Sessions  = () => {


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
          
          
            // ABOVE IS DRAWER LOGIC BELOW IS THE APP LOGIC.........................................................................................
          
        


  const sessionState = useSelector((state) => state.sessions);
  const {sessions, fetchingStatus} = sessionState;
  const rows = Array.isArray(sessions) ? sessions : [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

 const [page, setPage] = React.useState(0);
 const [rowsPerPage, setRowsPerPage] = React.useState(100);
 



   useEffect(() => {
     
        fetchData()  
      
    }, []);

  const fetchData = () => {
   dispatch(getAllSession());
  }




  const authenticated = false;
const logout = () => {
localStorage.removeItem('token');
navigate("/school/login")
localStorage.setItem('authenticated', JSON.stringify(authenticated));
}
  

       console.log("ROWS " + rows)

      const handleDelete = async (id)  => {
        // Filter out the deleted row
        rows.filter(row => row.id !== id);
        const result = await dispatch(deleteSession(id)).unwrap();
      };


        const handleEdit = (id) => {
        // Implement edit functionality
        navigate(`/admin/update-session/${id}`);
      };
    
     

   

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

    
    console.log(" Session " + JSON.stringify( rows));

   
    return (

      <>

      { fetchingStatus === 'loading' ? (<Loading/>) :  (

      <ClickAwayListener onClickAway={handleClickAway}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar */}
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
        {/* Dashboard Navbar Content */}
     <div style={{cursor: 'pointer'}} onClick={() => toggleChevron('chevron-0')}   className={[navbar['collapsible'], navbar[activeChevron === 'chevron-0' ?  'collapsible--expanded' : null]].join(' ')} >
       <header className={navbar['collapsible__header']}>
      <div className={navbar['collapsible__icon']}>

      <svg  class={[navbar['collapsible--icon'], navbar['icon--primary']].join(' ')}>
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
    <a href="/admin/home" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Home</a>
    <a href="/admin/schools" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Schools</a>
 <a href="/admin/all-session" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>sessions</a>
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
   <a href="/admin/profile" className={[navbar['link--drawer'], navbar['']].join(' ')}
onClick={(e) => e.stopPropagation()}>Profile</a>
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



{/* <div>{classNamesSpecific}</div> */}


            <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">S/N</StyledTableCell>
                          <StyledTableCell align="left">School Name</StyledTableCell>
                          <StyledTableCell align="left">Session</StyledTableCell>
                          <StyledTableCell align="left">Term</StyledTableCell>
                          <StyledTableCell align="left">is Current</StyledTableCell>
                          <StyledTableCell align="left">Status</StyledTableCell>
                          <StyledTableCell align="left">Expiry Date</StyledTableCell>
                          <StyledTableCell align="right">Action</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                      ).map((row, index) => (
                          <StyledTableRow key={row.id}>
                              <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.schoolName}
                            </StyledTableCell>
                            <StyledTableCell component="th" align="left">{row.session}</StyledTableCell>
                            <StyledTableCell component="th" align="left">{row.term}</StyledTableCell>
                            <StyledTableCell component="th" align="left">{row.current === true ? 'True' : 'False'}</StyledTableCell>
                            <StyledTableCell component="th" align="left">{row.status}</StyledTableCell>
                            <StyledTableCell component="th" align="left">{formatDate(row.expiryDate)}</StyledTableCell>
                            <StyledTableCell component="th" align="right">
                            <div>

                   
                        
                    <SessionActionMenu
                     row={row} 
                     onDelete={handleDelete}
                     onEdit={handleEdit} 
                     />
               
                  
               
                </div>
                            </StyledTableCell>
                                           
                          </StyledTableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                          colSpan={3}
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                            select: {
                              inputProps: {
                                'aria-label': 'rows per page',
                          
                              },
                              native: true,
                            },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
            
                          sx={{
                            "& .MuiTablePagination-toolbar": { fontSize: 18 }, // Adjust font size
                            "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                            "& .MuiTablePagination-input": { fontSize: 18 },
                            "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                           
                          }}
                        />
                      </TableRow>
                    </TableFooter>
                    </Table>
                  </TableContainer>
        </div>

             
       
      </Box>
      {/*This Area is for Snackbar*/}
        
              
    </Box>

     
    </ClickAwayListener> 

      )}
      </>
        
        
    );
}

export default Sessions;

















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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};