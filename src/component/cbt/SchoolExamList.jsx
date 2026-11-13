import { IconButton } from "@mui/material";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  deleteTeacherExam,
  duplicateTeacherExam,
  getTeacherExams
} from '../../redux/reducer/cbtSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import SchoolDrawer from '../utility/drawer/SchoolDrawer';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { Menu as MenuIcon } from "@mui/icons-material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';
import CbtExamListActionMenu from "../utility/CbtExamListActionMenu";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0e387a",
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 18 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

const SchoolExamList = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [anchorProfile, setAnchorProfile] = React.useState(null);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const profilePopup = (event) => setAnchorProfile(anchorProfile ? null : event.currentTarget);
  const openProfile = Boolean(anchorProfile);
  const idProfile = openProfile ? 'simple-popper' : undefined;
  const handleClickAway = () => setAnchorProfile(null);

  const cbtState = useSelector((state) => state.cbt);
  const { teacherExams, status } = cbtState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authenticated = false;
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/school/login");
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  };

  useEffect(() => { fetchData(); }, [location.pathname]);

  const fetchData = () => {
    dispatch(getTeacherExams());   // ✅ admin → all school exams
  };

  const rows = Array.isArray(teacherExams) ? teacherExams : [];

  const handleDetails = (id) => navigate(`/cbt/exam/details/${id}`);
  const navigateToCreateExam = () => navigate('/cbt/teacher/create-exam');
    const handleDelete = async (id) => {
      try {
        await dispatch(deleteTeacherExam(id)).unwrap();
      } catch (err) {
        alert(typeof err === 'string' ? err : (err?.error || err?.message || 'Delete failed'));
      }
    };
  
    const handleDuplicate = async (id) => {
      const newName = window.prompt(
        'Name for the duplicated exam (leave blank to auto-generate):'
      );
      if (newName === null) return;   // cancelled
  
      try {
        const result = await dispatch(duplicateTeacherExam({ examId: id, name: newName })).unwrap();
        navigate(`/cbt/exam/edit/${result.examId}`);
      } catch (err) {
        alert(typeof err === 'string' ? err : (err?.error || err?.message || 'Duplicate failed'));
      }
    };

  return (
    <>
      {status === 'loading' ? (<Loading />) : (
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
                  <IconButton
                    onClick={profilePopup}
                    sx={{ backgroundColor: "#0e387a", "&:hover": { backgroundColor: "#0c3371" } }}
                  >
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
    <div className={[dashboard['grid'], dashboard['grid--1x3']].join(' ')}>
 
  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
     <div className={dashboard['card_body']}>
       <div className={dashboard['card--small-head']}>My CBT Exams</div>
       <button onClick={navigateToCreateExam}
         className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}>
         Create New Exam
       </button>
     </div>
   </div>
 
 
  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
    <div className={dashboard['card_body']}>
      <div className={dashboard['card--small-head']}>Current Session CBT Exams</div>
      <div style={{ fontSize: 14, color: '#9a99ac', marginTop: 4 }}>
        You can duplicate and reuse exams from past sessions by clicking "Duplicate Previous Exams"
      </div>
    </div>
  </div>

  {/* ✅ NEW card */}
  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
    <div className={dashboard['card_body']}>
      <div className={dashboard['card--small-head']}>Duplicate Previous Exams</div>
      <button onClick={() => navigate('/cbt/teacher/previous-exams')}
        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}>
        View Previous Exams
      </button>
    </div>
  </div>


</div>

                <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="admin cbt exam table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">Exam No</StyledTableCell>
                        <StyledTableCell align="left">Subject</StyledTableCell>
                        <StyledTableCell align="left">Exam Name</StyledTableCell>
                        <StyledTableCell align="left">Class</StyledTableCell>
                        <StyledTableCell align="left">Slot</StyledTableCell>
                        <StyledTableCell align="left">Duration</StyledTableCell>
                        <StyledTableCell align="left">Created By</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <StyledTableCell colSpan={9} align="center">
                            No exams created yet this session.
                          </StyledTableCell>
                        </TableRow>
                      ) : (
                        rows.map((row, index) => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.examNo}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.subjectName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.className}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.assessmentSlot}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.durationMinutes} mins</StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.teacherName || <i style={{ color: '#bbb' }}>Admin</i>}
                            </StyledTableCell>
                           <StyledTableCell component="th" align="right">
                                                       <div>
                                                         <CbtExamListActionMenu
                                                           row={row}
                                                           onDelete={handleDelete}
                                                           onDuplicate={handleDuplicate}
                                                           onDetails={handleDetails}
                                                         />
                                                       </div>
                                                     </StyledTableCell>
                          </StyledTableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default SchoolExamList;