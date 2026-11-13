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
import { duplicateTeacherExam, getAllSchoolExams } from '../../redux/reducer/cbtSlice';
import Loading from '../Chunks/loading';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { AppBar, Box, Button, CssBaseline, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import navbar from '../style/dashboard/SchoolDashboard.module.css';

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

const PreviousExams = () => {
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

  const fetchData = () => dispatch(getAllSchoolExams());

  const rows = Array.isArray(teacherExams) ? teacherExams : [];

  const handleDuplicate = async (id) => {
    const newName = window.prompt('Name for the duplicated exam (leave blank to auto-generate):');
    if (newName === null) return;

    try {
      const result = await dispatch(duplicateTeacherExam({ examId: id, name: newName })).unwrap();
      navigate(`/cbt/teacher/edit/${result.examId}`);
    } catch (err) {
      alert(typeof err === 'string' ? err : (err?.error || err?.message || 'Duplicate failed'));
    }
  };

  const backToList = () => navigate('/cbt/teacher/list');

  return (
    <>
      {status === 'loading' ? (<Loading />) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ zIndex: 2, background: "white", color: "#0e387a" }}>
              <Toolbar sx={{ zIndex: 2, display: "flex", justifyContent: "space-between" }}>
            
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

          

            <Box component="main" sx={{
              flexGrow: 1, marginTop: 8, fontSize: 23,
              overflowX: 'auto', width: '100%', color: '#9a99ac',
              transition: "margin-left 0.3s ease-in-out",
            }}>
              <div className={dashboard['secondary--container']}>
                <div className={[dashboard['grid'], dashboard['grid--1x2']].join(' ')}>
                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>Duplicate Previous Exams</div>
                      <div style={{ fontSize: 14, color: '#9a99ac', marginTop: 4 }}>
                        All exams across all sessions. Click Duplicate to reuse one in the current session.
                      </div>
                    </div>
                  </div>

                  <div className={[dashboard['card--add'], dashboard['card--primary']].join(' ')}>
                    <div className={dashboard['card_body']}>
                      <div className={dashboard['card--small-head']}>Back to current list</div>
                      <button
                        onClick={backToList}
                        className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--primary']].join(' ')}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>

                <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                  <Table sx={{ minWidth: 750 }} aria-label="previous exams">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S/N</StyledTableCell>
                        <StyledTableCell align="left">Exam No</StyledTableCell>
                        <StyledTableCell align="left">Session</StyledTableCell>
                        <StyledTableCell align="left">Exam Name</StyledTableCell>
                        <StyledTableCell align="left">Subject</StyledTableCell>
                        <StyledTableCell align="left">Class</StyledTableCell>
                        <StyledTableCell align="left">Slot</StyledTableCell>
                        <StyledTableCell align="left">Created By</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <StyledTableCell colSpan={9} align="center">
                            No exams found across sessions.
                          </StyledTableCell>
                        </TableRow>
                      ) : (
                        rows.map((row, index) => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.examNo}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.sessionName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.subjectName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.className}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">{row.assessmentSlot}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {row.teacherName || <i style={{ color: '#bbb' }}>Admin</i>}
                            </StyledTableCell>
                            <StyledTableCell component="th" align="right">
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleDuplicate(row.id)}
                                sx={{ fontSize: 14, textTransform: 'none' }}
                              >
                                Duplicate
                              </Button>
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

export default PreviousExams;